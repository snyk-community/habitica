import content from '../content/index';
import i18n from '../i18n';
import {
  NotAuthorized,
} from '../libs/errors';
import splitWhitespace from '../libs/splitWhitespace';

module.exports = function releasePets (user, req = {}, analytics) {
  if (user.balance < 1) {
    throw new NotAuthorized(i18n.t('notEnoughGems', req.language));
  }

  user.balance -= 1;
  user.items.currentPet = '';

  for (let pet in content.pets) {
    user.items.pets[pet] = 0;
  }

  if (!user.achievements.beastMasterCount) {
    user.achievements.beastMasterCount = 0;
  }
  user.achievements.beastMasterCount++;

  if (analytics) {
    analytics.track('release pets', {
      uuid: user._id,
      acquireMethod: 'Gems',
      gemCost: 4,
      category: 'behavior'
    });
  }

  let response = {
    data: _.pick(user, splitWhitespace('user.items.pets')),
    message: i18n.t('petsReleased'),
  };

  return response;
};