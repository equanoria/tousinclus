"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const websocket_exception_filter_1 = require("./utils/filters/websocket-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new websocket_exception_filter_1.WebsocketExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Documentation de l'API")
        .setDescription('Description de votre API')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = Number.parseInt(process.env.PORT, 10) || 3001;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map