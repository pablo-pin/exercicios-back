import { Controller } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User/Documents')
@Controller('/user/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
}
