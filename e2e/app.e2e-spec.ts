import { AngCliPage } from './app.po';

describe('ang-cli App', function() {
  let page: AngCliPage;

  beforeEach(() => {
    page = new AngCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
