const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warning")
const OptionsModal = document.getElementById("options-modal")
const CakeModal = document.getElementById("cake-flavor")

let cart= []; 

//abrir o modal do carrinho
cartBtn.addEventListener("click",function(){
    cartModal.style.display = "flex"
})

//fechar modal quando clicar fora
cartModal.addEventListener("click",function(event){
    if(event.target == cartModal){
        cartModal.style.display ="none"
    }
})

//fechar com o botao "fechar"
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        const isEncomenda = parentButton.hasAttribute("data-order");
        const prazo = parentButton.getAttribute("data-prazo") || "";
        const requiresFlavor = parentButton.hasAttribute("data-flavor");

        // Se o item requer escolha de sabor, abre o modal de sabor
        if (requiresFlavor) {
            OptionsModal.style.display = "flex";
            OptionsModal.setAttribute("data-name", name);
            OptionsModal.setAttribute("data-price", price);
            OptionsModal.setAttribute("data-isEncomenda", isEncomenda);
            OptionsModal.setAttribute("data-prazo", prazo);
        } else {
            // Adiciona ao carrinho diretamente se não precisar de sabor
            addToCart(name, price, isEncomenda, prazo);
        }
    }


})
document.getElementById("confirm-add-to-cart").addEventListener("click", function() {
    const selectedFlavor = CakeModal.value;  // Obtém o sabor selecionado
    const name = OptionsModal.getAttribute("data-name");
    const price = parseFloat(OptionsModal.getAttribute("data-price"));
    const isEncomenda = OptionsModal.getAttribute("data-isEncomenda") === "true";
    const prazo = OptionsModal.getAttribute("data-prazo");

    // Adiciona o item ao carrinho com o sabor selecionado e informações de encomenda (se aplicável)
    addToCart(`${name} - Sabor: ${selectedFlavor}`, price, isEncomenda, prazo);

    // Fecha o modal
    OptionsModal.style.display = "none";

});
OptionsModal.addEventListener("click", function(event) {
    if (event.target == OptionsModal) {
        OptionsModal.style.display = "none";
    }
});


//Funçao para adicionar no carrinho
function addToCart(name, price, isEncomenda = false, prazo = "") {
    // Inclui a informação de encomenda no nome, se aplicável
    const displayName = isEncomenda ? `${name} (Encomenda - Pronto em ${prazo})` : name;

    const existingItem = cart.find(item => item.name === displayName);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: displayName, price, quantity: 1 });
    }

    // Animação do carrinho
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('cart-animation');
    
    setTimeout(() => {
        cartBtn.classList.remove('cart-animation');
    }, 500);

    updateCartModal();
}

  

    

function updateCartModal(){
    cartItemsContainer.innerHTML ="";
    let total = 0;


    cart.forEach(item => {
        const CartItemElement = document.createElement("div");
        CartItemElement.classList.add("flex", "justify-between", "flex-col")

        CartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(CartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//funcao para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal();
            return;
        }
    }
    cart.splice(index, 1);
    updateCartModal();

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }


})
//finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Ops o Restaurante está fechado",
            duration: 3000,
 
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
  },
        }).showToast();
const cartBtn = document.getElementById('cart-btn');

function addToCart(item) {
  // Lógica de adicionar item ao carrinho
  // ...

  // Adiciona a classe de animação
  cartBtn.classList.add('bounce');

  // Remove a classe de animação após a animação ser concluída
  setTimeout(() => {
    cartBtn.classList.remove('bounce');
  }, 500);
}



        return;
    }
    if(cart.length === 0) return;
    // Verifica se é delivery ou retirada na loja
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    let endereco = '';

    if (deliveryOption === 'delivery') {
        if (addressInput.value === "") {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
      return;
    } else {
      endereco = `Endereço de entrega: ${addressInput.value}`;
    }
  } else {
    endereco = "Endereço de retirada: rua Getulio Vargas 1940, Nossa Senhora das Graças - Porto Velho";
  }

  addressWarn.classList.add("hidden");
  addressInput.classList.remove("border-red-500");

  // Enviar o pedido para API WhatsApp
  const cartItems = cart.map((item) => {
    return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`;
}).join("");

const message = encodeURIComponent(`Olá, gostaria de fazer um pedido:\n\n${cartItems}\n${endereco}`);

  const phone = "+5569992532022";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  cart = [];
  updateCartModal();
});
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const dia = data.getDay(); // 0 é domingo, 6 é sábado

    if (dia >= 1 && dia <= 5) { // Segunda a sexta
        return hora >= 13 && hora < 18.5;
    } else if (dia === 6) { // Sábado
        return hora >= 11 && hora < 19;
    }
    return false; // Domingo fechado
}
    
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

/*const dailySpecials = {
    1: [ // Segunda-feira
        {
            name: "Bolo Azul",
            image: "./assets/boloAzul.png",
            description: "Delicioso bolo azul para alegrar sua segunda-feira!",
            price: 45.90
        },
        {
            name: "Cupcake de Chocolate",
            image: "./assets/cupcakeChocolate.png",
            description: "Cupcake de chocolate para um sabor doce na segunda-feira!",
            price: 7.90
        }
    ],
    2: [ // Terça-feira
        {
            name: "Bolo Verde",
            image: "./assets/boloVerde.png",
            description: "Um bolo verde refrescante para sua terça!",
            price: 47.90
        },
        {
            name: "Brigadeiro Gourmet",
            image: "./assets/brigadeiroGourmet.png",
            description: "Brigadeiro gourmet para uma tarde especial!",
            price: 2.50
        }
    ],
    // Continue para os outros dias da semana
    3: [ // Quarta-feira
        {
            name: "Bolo Vermelho",
            image: "./assets/boloVermelho.png",
            description: "Sabor marcante com nosso bolo vermelho!",
            price: 49.90
        },
        {
            name: "Coxinha Especial",
            image: "./assets/coxinhaEspecial.png",
            description: "Coxinha recheada com frango e catupiry, especial para a quarta-feira!",
            price: 5.00
        }
    ],
    4: [ // Quinta-feira
        {
            name: "Bolo Rosa",
            image: "./assets/brigadeiros.png",
            description: "Adoce sua quinta-feira com este bolo rosa!",
            price: 50.90
        },
        {
            name: "Trufa de Morango",
            image: "./assets/brigadeiros.png",
            description: "Trufa de morango para adoçar sua quinta!",
            price: 3.00
        }
    ],
    5: [ // Sexta-feira
        {
            name: "Bolo Amarelo",
            image: "./assets/Brownies.png" ,
            description: "Sabor tropical no nosso bolo amarelo de sexta-feira!",
            price: 52.90
        },
        {
            name: "Pão de Mel",
            image: "./assets/Brownies.png",
            description: "Delicioso pão de mel para fechar a semana com chave de ouro!",
            price: 4.00
        }
    ],
    6: [ // Sábado
        {
            name: "Bolo Branco",
            image: "./assets/boloBranco.png",
            description: "Um bolo clássico branco para seu sábado!",
            price: 54.90
        },
        {
            name: "Brownie de Chocolate",
            image: "./assets/brownie.png",
            description: "Brownie de chocolate para um sábado especial!",
            price: 6.00
        }
    ],
    0: [ // Domingo
        {
            name: "Bolo Especial de Domingo",
            image: "./assets/boloEspecial.png",
            description: "Especial de domingo para fechar a semana!",
            price: 56.90
        },
        {
            name: "Torta de Limão",
            image: "./assets/tortaLimao.png",
            description: "Torta de limão para refrescar o seu domingo!",
            price: 5.50
        }
    ]
};


function displayDailySpecial() {
    const today = new Date().getDay(); // Obtém o dia da semana (0 = Domingo, 1 = Segunda, ...)
    const specials = dailySpecials[today]; // Busca os itens especiais do dia atual
    
    const dailySpecialsContainer = document.getElementById("daily-specials");
    dailySpecialsContainer.innerHTML = ""; // Limpa o conteúdo anterior

    specials.forEach(special => {
        // Cria o elemento do item especial do dia
        const itemElement = document.createElement("div");
        itemElement.classList.add("flex", "gap-2", "shadow-md", "px-3", "py-3", "bg-white", "rounded-lg");

        itemElement.innerHTML = `
            <img 
                src="${special.image}" 
                alt="${special.name}"
                class="w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration-300" 
            />
            <div>
                <p class="font-bold">${special.name}</p>
                <p class="text-sm">${special.description}</p>
                <div class="flex items-center gap-2 justify-between mt-3">
                    <p class="font-bold text-lg">R$ ${special.price.toFixed(2)}</p>
                    <button 
                        class="bg-red-200 px-5 rounded add-to-cart-btn"
                        data-name="${special.name}" 
                        data-price="${special.price}"
                    >
                        <i class="fa fa-cart-plus text-lg text-red-400"></i>
                    </button>
                </div>
            </div>
        `;

        // Adiciona o item especial ao contêiner "Delícias do Dia"
        dailySpecialsContainer.appendChild(itemElement);

        // Configura o evento de clique para o botão "Adicionar ao Carrinho"
        const addToCartButton = itemElement.querySelector(".add-to-cart-btn");
        addToCartButton.addEventListener("click", function() {
            const name = addToCartButton.getAttribute("data-name");
            const price = parseFloat(addToCartButton.getAttribute("data-price"));
            addToCart(name, price); // Chama a função para adicionar o item ao carrinho
        });
    });
}

// Chama a função para exibir o item especial ao carregar a página

window.onload = function() {
    displayDailySpecial();
};
*/