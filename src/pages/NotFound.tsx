import { PageHead } from '../components/Layout';
import { link } from '../lib/router';

export default function NotFound() {
  return (
    <PageHead title="Page not found">
      <p>
        This address does not match a page on the site.{' '}
        <a className="lnk" href={link('/')}>
          Go to the home page
        </a>
        .
      </p>
    </PageHead>
  );
}
