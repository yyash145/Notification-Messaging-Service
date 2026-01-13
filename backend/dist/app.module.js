"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const plans_module_1 = require("./modules/plans/plans.module");
const excel_module_1 = require("./modules/excel/excel.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const messaging_module_1 = require("./modules/messaging/messaging.module");
const billing_module_1 = require("./modules/billing/billing.module");
const retention_module_1 = require("./modules/retention/retention.module");
const health_module_1 = require("./modules/health/health.module");
const typeorm_module_1 = require("@nestjs/typeorm/dist/typeorm.module");
const typeorm_config_1 = require("./database/typeorm.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_module_1.TypeOrmModule.forRoot(typeorm_config_1.typeOrmConfig),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            permissions_module_1.PermissionsModule,
            plans_module_1.PlansModule,
            excel_module_1.ExcelModule,
            scheduler_module_1.SchedulerModule,
            messaging_module_1.MessagingModule,
            billing_module_1.BillingModule,
            retention_module_1.RetentionModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map