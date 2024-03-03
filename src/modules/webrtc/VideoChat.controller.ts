import { Controller, Get, Render } from '@nestjs/common';
import { VideoChatService } from './videoChat.service';


@Controller()
  export class VideoChatController {
    constructor(private readonly videoChatService: VideoChatService) {}

    @Get()
    @Render('videoChat')
    async videoChat() {
      return this.videoChatService.startVideoChat();
    }
  }

  