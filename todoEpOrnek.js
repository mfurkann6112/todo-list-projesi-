const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const filterInput = document.querySelector("#todoSearch") || document.querySelector("#filter");
const clearButton = document.querySelector("#clearButton");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];


// JSON.parse methhodu ile LocalStorage'dan Todoları çekme console.com applicasion source bölümünden...
let todos = JSON.parse(localStorage.getItem("todos")) || [];  // || Veya operatörü anlamında kullanılır..


function runEvents() {
    // Sayfa yüklendiğinde DOMContet çalışssın...
    document.addEventListener("DOMContentLoaded", () => eylemiTetikle("load"));
   
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Sayfa yüklemeyi engeller..
            eylemiTetikle("add");
        });
    }

    if (filterInput) {
        filterInput.addEventListener("keyup", (e) => { // keyup: Klavyeden elini tuştan çektikten sonra çalış.
            eylemiTetikle("filter", e.target.value); // 
        });
    }

    if (secondCardBody) {
        secondCardBody.addEventListener("click", (e) => {
            const deleteTarget = e.target.closest(".delete-item") || (e.target.matches(".fa-remove, .fa-trash-can, .fa-xmark") ? e.target : null);
            
            if (deleteTarget) {
                e.preventDefault();
                const liItem = deleteTarget.closest("li");
                eylemiTetikle("remove", liItem);
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", (e) => {
            e.preventDefault();
            eylemiTetikle("clearAll");
        });
    }
}

function eylemiTetikle(islemTuru, veri = null) { 
    switch (islemTuru) {
        // 1. Sayfa ilk açıldığında listeyi ekrana çiz
        case "load":
            ekranaBas();
            break;  // Kırmak anlamında kullanılır.

        case "add": {
            const yeniTodoMetni = addInput.value.trim();  // Sağdan soldan trim ile düzenle..

            if (yeniTodoMetni === "") {
                showAlert("danger", "Lütfen bir Todo giriniz....!");
                return;
            }

            todos.push(yeniTodoMetni);  // push methodu ile yeni todo ekleme..
            syncStorage();
            ekranaBas();
            addInput.value = "";
            showAlert("success", "Todo Başarıyla eklendi....");
            break;
        }

        case "remove": {  // Toduyu kaldırma  işlemi
            if (!veri) break;

            const textSpan = veri.querySelector(".todo-text");
            const silinecekMetin = textSpan ? textSpan.textContent.trim() : veri.firstChild.textContent.trim();

           
            // Diziden bul ve sil
            const siraNo = todos.indexOf(silinecekMetin);
            if (siraNo !== -1) {
                todos.splice(siraNo, 1);
                syncStorage();
                ekranaBas();
                showAlert("success", "Todo silindi.");
            }
            break;
        }

        // 4. Tüm todoları temizleme işlemi
        case "clearAll":
            if (todos.length > 0) { // length: 0 dan büyükse 
                todos = [];
                syncStorage();
                ekranaBas();
                showAlert("success", "Tüm todolar temizlendi...!");
            } else {
                showAlert("warning", "Temizlenecek todo bulunamadı.");
            }
            break;

        // 5. Arama kutusuna göre filtreleme işlemi
        case "filter": {
            const arananMetin = veri.toLowerCase().trim();
            const listeElemanlari = document.querySelectorAll(".list-group-item");

            listeElemanlari.forEach((eleman) => {
                const textSpan = eleman.querySelector(".todo-text");
                const elemanMetni = textSpan ? textSpan.textContent.toLowerCase() : eleman.textContent.toLowerCase();
                const eslesiyorMu = elemanMetni.includes(arananMetin);

                eleman.style.setProperty("display", eslesiyorMu ? "flex" : "none", "important");
            });
            break;
        }
    }
}

// Swich case kullanmaya çalıştığım eğitimimden pekiştirmek için hoca başka bir yol izlemişti...

function ekranaBas() {
    if (!todoList) return;
    todoList.innerHTML = "";

    todos.forEach((todo) => {      // ForEach ile todo elamanlarını dön 
        const li = document.createElement("li"); // li elemanlarını tanımla
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo;

        const a = document.createElement("a");
        a.href = "#";
        a.className = "delete-item text-decoration-none";
        a.innerHTML = '<i class="fa-solid fa-trash-can fa-remove text-danger"></i>';


        // appendChild ile li elemanların bir altına ulaş..
        li.appendChild(span);   
        li.appendChild(a);
        todoList.appendChild(li);

    });
}

function syncStorage() {  // LocalStorage   consol.log açtığında application source bölümünde..
    localStorage.setItem("todos", JSON.stringify(todos));
}



function showAlert(type, message) {  // Uyarı mesajı...
    if (!firstCardBody) return;
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;

    firstCardBody.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 2500);
}


runEvents();

// Öğrendiklerimden aklımda kalanları değiştirerek yapmaya çalıştım umarım beğenirsin : )
// Güncel Bootsrap kütüphanesini de kullandım..