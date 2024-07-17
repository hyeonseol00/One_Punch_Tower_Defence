import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createData = (data) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;

  const encodedData = JSON.stringify(data);
  const responsePayload = { data: encodedData };

  const buffer = Response.encode(responsePayload).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

  const result = Buffer.concat([packetLength, packetType, buffer]);
  return result;
};
