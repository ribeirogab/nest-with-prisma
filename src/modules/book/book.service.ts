import { Injectable } from '@nestjs/common';

import { PrismaService } from './../../database/prisma.serivce';
import { UpsertBookDto } from './dtos/upsert-book.dto';
import { Book } from './interfaces/book.interface';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  public upsert(data: UpsertBookDto): Promise<Book> {
    return this.prisma.book.upsert({
      where: { bar_code: data.bar_code },
      update: { ...data, deleted_at: null },
      create: data,
    });
  }

  public find(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
  }
}
