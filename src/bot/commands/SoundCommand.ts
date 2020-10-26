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
    const messageCopy = Object.assign({}, message);
    message.delete({ timeout: 1000 })
      .then(data => console.log(data))
      .catch(console.error);
    if (!messageCopy.member) return;

    const sound = messageCopy.content;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = messageCopy.member.voice;
    if (!voiceChannel) {
      messageCopy.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, messageCopy));
  }
}
