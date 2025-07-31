import { INestApplication } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { apiReference } from '@scalar/nestjs-api-reference';
import { customCss } from './cssDocs';

export class AppDoc {
  private document: OpenAPIObject | Record<string, any>;

  constructor(private readonly app: INestApplication) {
    this.init();
  }

  private init() {
    const config = new DocumentBuilder()
      .setTitle(process.env.APP_NAME || 'API')
      .setDescription(process.env.APP_DESCRIPTION || 'Documentação da API')
      .setVersion(process.env.APP_VERSION || '0.0')
      .addBearerAuth()
      .addTag('Login')
      .build();

    this.document = SwaggerModule.createDocument(this.app, config);
    this.parseGroups();

    this.app.use(
      '/docs',
      apiReference({
        theme: 'purple',
        darkMode: false,
        hideModels: true,
        hideDownloadButton: true,
        spec: {
          content: this.document,
        },
        customCss: customCss,
      }),
    );
  }

  private parseGroups() {
    const modulos = this.app.get<ModulesContainer>(ModulesContainer);
    const reflector = this.app.get(Reflector);
    const groupsMap = new Map<string, Set<string>>();
    for (const modulo of modulos.values()) {
      for (const wrapper of modulo.controllers.values()) {
        const metatype = wrapper.metatype;
        if (!metatype) continue;
        const tags = reflector.get<string[]>(DECORATORS.API_TAGS, metatype) || [];

        if (tags.length !== 1) {
          console.warn(`Controller ${metatype.name} deve ter exatamente uma tag definida.`);
          continue;
        }

        const tag = tags[0];
        const tagNameParts = tag.split('/');
        if (tagNameParts.length >= 2) {
          const grupo = tagNameParts[0];
          if (!groupsMap.has(grupo)) {
            groupsMap.set(grupo, new Set());
          }
          tags.forEach((tag) => groupsMap.get(grupo).add(tag));
        }
      }
    }
    this.document['x-tagGroups'] = Array.from(groupsMap.entries()).map(([name, tags]) => ({
      name,
      tags: Array.from(tags),
    }));
  }

  /**
   * Retorna o número total de rotas documentadas.
   * @returns Número total de rotas.
   */
  public getTotalRoutes(): number {
    return Object.keys(this.document.paths || {}).length;
  }

  /**
   * Retorna o documento OpenAPI gerado.
   * @returns Documento OpenAPI.
   */
  public getDocument(): OpenAPIObject | Record<string, any> {
    return this.document;
  }
}
