import { StockwatchCliPage } from './app.po';

describe('stockwatch-cli App', function() {
  let page: StockwatchCliPage;

  beforeEach(() => {
    page = new StockwatchCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
