import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsServiceService } from './analytics-service.service';
import { GenerateAnalyticsDto } from './dto/generateAnalytics.dto';

@Controller('generate-analytics')
export class AnalyticsServiceController {
  constructor(private readonly analyticsService: AnalyticsServiceService) {}

  @Post()
  generate(@Body() generateAnalyticsDto: GenerateAnalyticsDto) {
    return this.analyticsService.generateAnalytics(generateAnalyticsDto);
  }
}
