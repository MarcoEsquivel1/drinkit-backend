import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriberControlService {
  private enabledSubscribers: Set<string> = new Set();

  enableSubscriber(subscriberName: string): void {
    this.enabledSubscribers.add(subscriberName);
  }

  disableSubscriber(subscriberName: string): void {
    this.enabledSubscribers.delete(subscriberName);
  }

  isSubscriberEnabled(subscriberName: string): boolean {
    return this.enabledSubscribers.has(subscriberName);
  }

  getAllEnabledSubscribers(): string[] {
    return Array.from(this.enabledSubscribers);
  }
}
