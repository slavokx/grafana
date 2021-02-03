import { Field, GrafanaTheme, LinkModel } from '@grafana/data';
import { css } from 'emotion';
import React from 'react';
import { useStyles } from '../../themes';
import { Icon } from '../Icon/Icon';
import { DataLinkButton } from './DataLinkButton';

type Props = {
  links: Array<LinkModel<Field>>;
};

export function FieldLink({ links }: Props) {
  const styles = useStyles(getStyles);

  if (links.length === 1) {
    return <DataLinkButton link={links[0]} />;
  }

  const externalLinks = links.filter((link) => link.target === '_blank');
  const internalLinks = links.filter((link) => link.target === '_self');

  return (
    <>
      {internalLinks.map((link, i) => {
        return <DataLinkButton key={i} link={link} />;
      })}
      <div className={styles.wrapper}>
        <p className={styles.externalLinksText}>External links</p>
        {externalLinks.map((link, i) => (
          <a key={i} href={link.href} target={link.target} className={styles.externalLink}>
            <Icon name="external-link-alt" />
            {link.title}
          </a>
        ))}
      </div>
    </>
  );
}

const getStyles = (theme: GrafanaTheme) => ({
  wrapper: css`
    flex-basis: 150px;
    width: 100px;
  `,
  externalLinksText: css`
    color: ${theme.colors.textWeak};
    font-weight: ${theme.typography.weight.regular};
    font-size: ${theme.typography.size.sm};
    margin: 0;
  `,
  externalLink: css`
    color: ${theme.colors.text};
    font-weight: ${theme.typography.weight.regular};
    display: block;
    margin-top: ${theme.spacing.sm};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    div {
      margin-right: ${theme.spacing.sm};
    }
  `,
});
