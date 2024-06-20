import { Controller, Post, Body } from '@nestjs/common';
import { ReportService } from './report-service.service';
import { GenerateReportDto } from './dto/generateReport.dto';

@Controller('generate-report')
export class ReportServiceController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  generate(@Body() generateReportDto: GenerateReportDto) {
    return this.reportService.generateReport(generateReportDto);
  }
}
