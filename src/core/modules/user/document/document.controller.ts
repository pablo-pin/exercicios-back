import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/utils/decorators/user-id.decorator';
import { UploadUserDocumentDto } from './dto/document.dto';
import { Doc } from 'src/utils/documentation/doc';
import { UserDocumentResponse } from './docs/user-document.doc';

@ApiTags('User/Documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('/user/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Doc({
    name: 'Save document',
    response: UserDocumentResponse,
    statusCode: HttpStatus.CREATED,
  })
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async save(
    @Body() body: UploadUserDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return await this.documentService.save({ userId, body, file });
  }

  @Doc({
    name: 'List documents',
    response: UserDocumentResponse,
    isArray: true,
  })
  @Get('')
  async list(@UserId() userId: string) {
    return await this.documentService.list(userId);
  }

  @Doc({
    name: 'Delete document',
    description: 'Delete an unvalidated document',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete(':documentId')
  async delete(@UserId() userId: string, @Param('documentId') documentId: string) {
    return await this.documentService.delete({ userId, documentId });
  }
}
