import { Controller, Post, Body } from '@nestjs/common';
import { ReportServiceService } from './report-service.service';
import { GenerateReportDto } from './dto/generateReport.dto';

@Controller('generate-report')
export class ReportServiceController {
  constructor(private readonly reportService: ReportServiceService) {}

  @Post()
  generate(@Body() generateReportDto: GenerateReportDto) {
    return this.reportService.generateReport(generateReportDto);
  }
}
