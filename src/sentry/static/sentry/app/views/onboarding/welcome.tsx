import React from 'react';
import styled from '@emotion/styled';
import {motion, MotionProps} from 'framer-motion';

import Button from 'app/components/button';
import {t, tct} from 'app/locale';
import space from 'app/styles/space';
import {Organization} from 'app/types';
import {analytics} from 'app/utils/analytics';
import withOrganization from 'app/utils/withOrganization';

import FallingError from './components/fallingError';
import WelcomeBackground from './components/welcomeBackground';
import {StepProps} from './types';

const recordAnalyticsOnboardingSkipped = ({organization}: {organization: Organization}) =>
  analytics('onboarding_v2.skipped', {org_id: organization.id});

type Props = StepProps & {
  organization: Organization;
};

const easterEggText = [
  t("Wan't to destroy real errors? Get started."),
  t('Looks like you missed the target there.'),
  t("It's the purple button, right up there"),
  tct("Ok, really, that's enough. Click [ready:I'm Ready].", {ready: <i />}),
  tct("Ok, next time you do that, [bold:we're starting]", {bold: <strong />}),
  t("We weren't lying to you, time to onboard"),
];

const fadeAway: MotionProps = {
  variants: {
    initial: {opacity: 0},
    animate: {opacity: 1, filter: 'blur(0px)'},
    exit: {opacity: 0, filter: 'blur(1px)'},
  },
  transition: {duration: 0.8},
};

const OnboardingWelcome = ({organization, onComplete, active}: Props) => {
  const skipOnboarding = () => recordAnalyticsOnboardingSkipped({organization});

  return (
    <FallingError
      onFall={fallCount => fallCount >= easterEggText.length && onComplete({})}
    >
      {({fallingError, fallCount, triggerFall}) => (
        <Wrapper>
          <WelcomeBackground />
          <motion.h1 {...fadeAway}>{t('Welcome to Sentry')}</motion.h1>
          <motion.p {...fadeAway}>
            {t(
              'Find the errors and performance slowdowns that keep you up at night. In two steps.'
            )}
          </motion.p>
          <CTAContainer {...fadeAway}>
            <Button
              data-test-id="welcome-next"
              disabled={!active}
              priority="primary"
              onClick={() => {
                triggerFall();
                onComplete({});
              }}
            >
              {t("I'm Ready")}
            </Button>
            <PositionedFallingError>{fallingError}</PositionedFallingError>
          </CTAContainer>
          <SecondaryAction {...fadeAway}>
            {tct('[flavorText][br][exitLink:Skip onboarding].', {
              br: <br />,
              exitLink: <Button priority="link" onClick={skipOnboarding} href="/" />,
              flavorText:
                fallCount > 0
                  ? easterEggText[fallCount - 1]
                  : t('Geez Mom, I’ve used Sentry before.'),
            })}
          </SecondaryAction>
        </Wrapper>
      )}
    </FallingError>
  );
};

const CTAContainer = styled(motion.div)`
  margin-bottom: ${space(2)};
  position: relative;

  button {
    position: relative;
    z-index: 2;
  }
`;

const PositionedFallingError = styled('span')`
  display: block;
  position: absolute;
  top: 30px;
  right: -5px;
  z-index: 0;
`;

const SecondaryAction = styled(motion.small)`
  color: ${p => p.theme.subText};
  margin-top: 100px;
`;

const Wrapper = styled(motion.div)`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 100px;

  h1 {
    font-size: 42px;
  }
`;

Wrapper.defaultProps = {
  variants: {exit: {x: 0}},
  transition: {
    staggerChildren: 0.2,
  },
};

export default withOrganization(OnboardingWelcome);
