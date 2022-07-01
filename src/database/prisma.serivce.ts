import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deleted_at: new Date().toISOString() };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deleted_at'] = new Date().toISOString();
        } else {
          params.args['data'] = { deleted_at: new Date().toISOString() };
        }
      }

      return next(params);
    });

    this.$use(async (params, next) => {
      if (!params.args) {
        params.args = {};
      }

      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.action = 'findFirst';
        params.args.where['deleted_at'] = null;
      }

      if (params.action === 'findMany') {
        if (params?.args?.where) {
          if (params.args?.where?.deleted_at == undefined) {
            params.args.where['deleted_at'] = null;
          }
        } else {
          params.args.where = { deleted_at: null };
        }
      }

      return next(params);
    });

    this.$use(async (params, next) => {
      if (params.action == 'update') {
        params.action = 'updateMany';

        params.args.where['deleted_at'] = false;
      }

      if (params.action == 'updateMany') {
        if (params.args.where != undefined) {
          params.args.where['deleted_at'] = null;
        } else {
          params.args['where'] = { deleted_at: null };
        }
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
