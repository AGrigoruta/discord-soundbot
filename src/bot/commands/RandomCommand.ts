import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import * as soundsDb from '@util/db/Sounds';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class RandomCommand implements Command {
  public readonly TRIGGERS = ['random'];
  public readonly NUMBER_OF_PARAMETERS = 1;

  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, params: string[]) {
    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    const sounds = params.length === this.NUMBER_OF_PARAMETERS
      ? soundsDb.withTag(params[0])
      : getSounds();

    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
