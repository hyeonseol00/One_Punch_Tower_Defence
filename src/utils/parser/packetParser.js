import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = async (data) => {
  const protoMessages = getProtoMessages();

  const PayloadType = protoMessages.request.Request;
  let payload;
  try {
    payload = PayloadType.decode(data);
  } catch (err) {
    throw new Error('패킷 구조가 일치하지 않습니다.');
  }

  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0)
    throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);

  return await JSON.parse(payload);
};
