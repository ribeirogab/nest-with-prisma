import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { UpsertBookDto } from './dtos/upsert-book.dto';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  public upsert(@Body() data: UpsertBookDto) {
    return this.bookService.upsert(data);
  }

  @Get()
  public find() {
    return this.bookService.find();
  }

  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
