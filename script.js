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


menu.addEventListener("click",function(event){
    let parentButton= event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToCart(name,price)
    }

})

//Funçao para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
  
    // Animação do carrinho
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('cart-animation');
    
    setTimeout(() => {
      cartBtn.classList.remove('cart-animation');
    }, 500); // Duração da animação
  
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
  const phone = "69984087881";

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