import { ApiProperty } from '@nestjs/swagger';
import { ICard, IDeck, IGroup, ITranslation } from '@tousinclus/types';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// ========== DTO ==========

export class ITranslationDTO implements ITranslation {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Requested language',
    example: 'en',
  })
  requestLanguage: string;
}

export class ICardDTO extends ITranslationDTO implements ICard {
  @IsInt()
  @ApiProperty({
    description: 'ID of the card',
    example: 42,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of the card',
    example: 'users',
    enum: ['users', 'situations'],
  })
  type: 'users' | 'situations';
}

export class IGroupDTO extends ITranslationDTO implements IGroup {
  @IsInt()
  @ApiProperty({
    description: 'ID of the card group',
    example: 10,
  })
  id: number;
}

export class IDeckDTO extends ITranslationDTO implements IDeck {
  @IsInt()
  @ApiProperty({
    description: 'ID of the deck',
    example: 5,
  })
  id: number;
}
