describe("login one time ", () => {
  beforeEach(() => {
    cy.login("dinhbinhkhanv@gmail.com", "merci2024");
  });
  let listId = [
    "P-SS-202412292479",
    "P-SS-202412292480",
  ];

  listId.forEach((setId) => {
    it("Search Set ID", () => {
      cy.visit("https://openframe.inc/bpo/requests");
      cy.get("input[name=q]").type(setId);
      cy.get("form#requestFilterForm").within(() => {
        cy.get("select[name=request_sorts]").select("Shooting date: Ascending");
        cy.get("button[type=submit]").click();
      });
      let foundIndex = -1; // Khởi tạo biến foundIndex với giá trị -1
      let found = false; // Khởi tạo biến found với giá trị false

      cy.get("tbody tr")
        .each(($tr, index) => {
          if (found) {
            return false; // Thoát khỏi vòng lặp ngoài nếu đã tìm thấy
          }

          cy.wrap($tr)
            .within(() => {
              cy.get("td.text-nowrap").each(($td) => {
                // Lặp qua tất cả các td.text-nowrap
                const text = $td.text().trim();
                if (text === setId) {
                  foundIndex = index; // Lưu chỉ mục vào biến foundIndex
                  found = true; // Đặt biến found thành true
                  return false; // Thoát khỏi vòng lặp trong (td)
                }
              });
            })
            .then(() => {
              if (found) {
                return false; // Thoát khỏi vòng lặp ngoài(tr) nếu tìm thấy setId
              }
            });
        })
        .then(() => {
          if (foundIndex !== -1) {
            cy.log(`setId found at index: ${foundIndex}`);
            // Sử dụng foundIndex để thực hiện các thao tác tiếp theo
            cy.get(`tbody tr:eq(${foundIndex})`).within(() => {
              // Thực hiện các thao tác trên hàng tìm thấy
              cy.get("select[name=bpo_id]").select("Đinh Bỉnh Khang", { force: true });
              cy.get("button[type=submit]").click();
              cy.get("a").contains("View").click();
            });
            cy.wait(500);

            // Khang định Url lấy được đúng với ID cung cấp
            cy.get("table tr:first td:first").then(($row) => {
              const text = $row.text().trim();
              expect(text).to.equal(setId);
            });
          } else {
            cy.log(`setId "${setId}" not found in any row.`);
          }
        });

      // write file
      cy.location().then((loc) => {
        cy.writeFile("cypress/downloads/listUrl.txt", loc.href + "\n", {
          encoding: "ascii",
          flag: "a+",
        });
      });
      // End Write file
    });
  });
});
