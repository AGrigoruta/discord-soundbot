import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    if (!message.member) {
      message.delete({ timeout: 1000 })
        .then(data => console.log('Not a member'))
        .catch(err => console.error(err))
      return;
    }

    const sound = message.content;
    if (!existsSound(sound)) {
      message.delete({ timeout: 1000 })
        .then(data => console.log('No sound'))
        .catch(err => console.error(err))
      return;
    }

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      message.delete({ timeout: 1000 })
        .then(data => console.log('No voice channel'))
        .catch(err => console.error(err))
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
    message.delete({ timeout: 1000 })
      .then(data => console.log('gud'))
      .catch(err => console.error(err))
  }
}
