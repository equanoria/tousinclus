import { EAction } from 'src/auth/abilities/types/Action';
import { RoomDocument } from './schemas/room.schema';
import { ERole } from '@tousinclus/types';
import { DefineAbilities } from 'src/auth/abilities/types/Ability';

export const defineRoomAbilities: DefineAbilities = ({
  can,
  withRoles,
  user,
}) => {
  withRoles(ERole.HOST, () => {
    can(EAction.MANAGE, RoomDocument, { createdBy: user.id });
  });
};
