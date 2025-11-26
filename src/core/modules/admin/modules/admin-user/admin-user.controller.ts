import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { Doc } from 'src/utils/documentation/doc';
import { AdminListDocumentsDto } from './dto/list-documents.dto';
import { AdminUserDocumentResponse } from './docs/admin-user.doc';

@ApiTags('Admin/Users/Documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('/admin/users/documents')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Doc({
    name: 'List documents',
    response: AdminUserDocumentResponse,
    isArray: true,
  })
  @Get('')
  async list(@Query() query: AdminListDocumentsDto) {
    return await this.adminUserService.list(query);
  }

  @Doc({
    name: 'Approve document',
    response: AdminUserDocumentResponse,
  })
  @Patch(':documentId/approve')
  async approve(@Param('documentId') documentId: string) {
    return await this.adminUserService.approve(documentId);
  }
}
