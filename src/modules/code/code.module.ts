import { Module } from '@nestjs/common';
import { CodeService } from '@/modules/code/code.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CodeModel } from '@/modules/code/code.model';
import { MailService } from '@/modules/mail/mail.service';
import { MailModule } from '@/modules/mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([CodeModel]), MailModule],
  providers: [CodeService, MailService],
  exports: [CodeService, MailService],
})
export class CodeModule {}
