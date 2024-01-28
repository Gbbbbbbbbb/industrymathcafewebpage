const root = document.getElementById("root");
      const div = document.createElement("div");
      for (let i = 0; i < 5; i++) {
        const div = document.createElement("div");
        div.textContent = `Hello div ${i + 1}`;
        if (i % 2 === 0) {
          div.classList.add("even");
        } else {
          div.classList.add("odd");
        }
        root.append(div);
      }

      const arr = ["one", "two", "셋", "넷", "다섯"];
      const ul = document.createElement("ul");

      for (const item of arr) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.append(li);
      }
      root.append(ul);