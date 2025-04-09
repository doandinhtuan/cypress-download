describe('Tạo test riêng cho mỗi setId từ file', () => {
  let listId = [];
  beforeEach(() => {
    cy.login("dinhbinhkhanv@gmail.com", "merci2024");
    cy.task('readSetIds').then((ids) => {
      listId = ids;
    });
  });

  it(`Lấy Url cho các SetId`, () => {
    expect(listId.length).to.be.greaterThan(0);
    cy.log('Total: ', listId.length)
  });

  // Không thể dùng listId.forEach(...) trực tiếp ở đây vì async
  // Ta sẽ chạy tất cả trong 1 vòng lặp bên trong `it()` duy nhất:
  it('chạy tất cả test cho từng setId', () => {
    listId.forEach((setId) => {
      cy.log(`🔍 Xử lý Set ID: ${setId}`);
      cy.visit("https://openframe.inc/bpo/requests");
      cy.get("input[name=q]").type(setId);
      cy.get("form#requestFilterForm").within(() => {
        cy.get("select[name=request_sorts]").select("Shooting date: Ascending");
        cy.get("button[type=submit]").click();
      });

      let foundIndex = -1;
      let found = false;

      cy.get("tbody tr")
        .each(($tr, index) => {
          if (found) return false;

          cy.wrap($tr).within(() => {
            cy.get("td.text-nowrap").each(($td) => {
              const text = $td.text().trim();
              if (text === setId) {
                foundIndex = index;
                found = true;
                return false;
              }
            });
          });
        })
        .then(() => {
          if (foundIndex !== -1) {
            cy.get(`tbody tr:eq(${foundIndex})`).within(() => {
              cy.get("select[name=bpo_id]").select("Đinh Bỉnh Khang", { force: true });
              cy.get("button[type=submit]").click();
              cy.get("a").contains("View").click();
            });

            cy.wait(500);
            cy.get("table tr:first td:first").then(($row) => {
              const text = $row.text().trim();
              expect(text).to.equal(setId);
            });
          } else {
            cy.log(`❌ Không tìm thấy ${setId}`);
          }
        });

      cy.location().then((loc) => {
        cy.writeFile("cypress/downloads/listUrl.txt", loc.href + "\n", {
          encoding: "ascii",
          flag: "a+",
        });
      });
    });
  });
});
