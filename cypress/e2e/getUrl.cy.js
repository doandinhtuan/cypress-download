const listId = ["P-SS-20241229001", "P-SS-20241229002"];

describe('Lấy list Url ', () => {
  beforeEach(() => {
    cy.login("dinhbinhkhanv@gmail.com", "merci2024");
  });

  listId.forEach((setId) => {
    it(`Đang xử lý cho set id ${setId}`, () => {
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
