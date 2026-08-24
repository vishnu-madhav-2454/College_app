import twilio from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const normalizePhone = (value) => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.startsWith('0')) return `+91${digits.slice(1)}`;
  return `+${digits}`;
};

export const sendParentResultMessage = async ({
  parentPhone,
  studentName,
  testName,
  totalObtained,
  totalMax,
  percentage,
  remarks,
}) => {
  const formattedPhone = normalizePhone(parentPhone);

  if (!formattedPhone) {
    return {
      success: false,
      mode: 'disabled',
      message: 'Parent phone number not available for SMS.',
    };
  }

  const messageText = `Apex Academy: ${studentName} scored ${totalObtained}/${totalMax} in ${testName} (${percentage}%). ${remarks || 'Keep up the good work!'} Please contact the academy for feedback.`;

  if (!twilioClient || !process.env.TWILIO_FROM_NUMBER) {
    return {
      success: false,
      mode: 'demo',
      phone: formattedPhone,
      messageText,
      message: 'Twilio is not configured yet. SMS is simulated in demo mode.',
    };
  }

  try {
    const result = await twilioClient.messages.create({
      body: messageText,
      from: process.env.TWILIO_FROM_NUMBER,
      to: formattedPhone,
    });

    return {
      success: true,
      mode: 'twilio',
      sid: result.sid,
      phone: formattedPhone,
      messageText,
    };
  } catch (error) {
    return {
      success: false,
      mode: 'error',
      phone: formattedPhone,
      messageText,
      error: error.message,
    };
  }
};
