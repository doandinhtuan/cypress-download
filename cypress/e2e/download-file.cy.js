describe('Download List Url', () => {
  const urls = [
    'https://openframe.inc/bpo/requests/9871',
    'https://openframe.inc/bpo/requests/12200',
    'https://openframe.inc/bpo/requests/12201',
  ];
  const downloadDir = "D:/test";

  before(() => {
    cy.login('dinhbinhkhanv@gmail.com', 'merci2024');
  });

  it('downloads each file and waits for it to finish', () => {
    urls.forEach((url) => {
      cy.visit(url);
      cy.intercept('POST', '**/livewire/update').as('livewire');
      cy.contains('button', 'RAW DL').click();
      cy.wait('@livewire');

        // ⏳ Chờ cho đến khi file .crdownload BẮT ĐẦU xuất hiện
      cy.waitUntil(() =>
        cy.task('isCrdownloadStarted', downloadDir), {
          timeout: 30000,  // chờ tối đa 30 giây để bắt đầu tải
          interval: 1000,
        }
      );

      // ⏳ Chờ cho đến khi không còn file .crdownload trong thư mục
      cy.waitUntil(() =>
        cy.task('isDownloadFinished', downloadDir), {
          timeout: 300000,  // chờ tối đa 5 phút cho 1 file lớn
          interval: 5000    // kiểm tra mỗi 5 giây
        }
      );

      // ✅ Xác nhận xong 1 file
      cy.log(`✅ Đã tải xong tại ${url}`);
    });
  });
});
