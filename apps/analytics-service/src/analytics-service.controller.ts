import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics-service.service';
import { GenerateAnalyticsDto } from './dto/generateAnalytics.dto';

@Controller('generate-analytics')
export class AnalyticsServiceController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  generate(@Body() generateAnalyticsDto: GenerateAnalyticsDto) {
    return this.analyticsService.generateAnalytics(generateAnalyticsDto);
  }
}
