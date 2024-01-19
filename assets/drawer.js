function formatMoney(cents, format) {
    if (typeof cents == 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || this.money_format;

    function defaultOption(opt, def) {
      return typeof opt == 'undefined' ? def : opt;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents = parts[1] ? decimal + parts[1] : '';

      return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  
function addCartDrawerListeners() {
      document.querySelectorAll('.cart-quantity button').forEach((button) => {
        button.addEventListener('click', () => {
          const input = button.parentElement.querySelector('input');
          const value = Number(input.value);
          const isPlus = button.classList.contains('plus');
          const key = button.closest('.item_wrapper').getAttribute('data-key');
    
          if (isPlus) {
            const newValue = value + 1;
            input.value = newValue;
            updateItemQuantity(key, newValue);
          } else if (value > 1) {
            const newValue = value - 1;
            input.value = newValue;
            updateItemQuantity(key, newValue);
          }


        });
      });
    
      document.querySelectorAll('.item-remove').forEach((remove)=> {
        remove.addEventListener('click', (e) => {
          e.preventDefault();
    
          const item = remove.closest('.item_wrapper');
          const key = item.getAttribute('data-key');
          axios.post('/cart/change.js', {
            id : key,
            quantity : 0,
          }).then((res) => {
       
            const format = document.querySelector('[data-money-format]').getAttribute('data-money-format');
              const totalDiscount = formatMoney(res.data.total_discount, format);
              const totalPrice = formatMoney(res.data.original_total_price,format);
            const subtotalPrice = formatMoney(res.data.total_price,format);

              document.querySelector('.discount-label').textContent = totalDiscount;
            document.querySelector('.subtotal-label').textContent = subtotalPrice;
             document.querySelector('.totals-label').textContent = totalPrice;
            if(res.data.items.length === 0){
              document.querySelector('.form_wrapper').remove();
              const html = document.createElement('div');
              html.innerHTML = 
              `<p>Nothing in your cart yet</p>
              <a href="">
                <p class="w-[80%] py-2 text-center my-10 mx-2 border border-gray-500 rounded-full">Continue Shopping</p>
              </a>`
    
              document.querySelector('.drawer__content').appendChild(html);
            }else{
              

              item.remove();
            }

            // updating cart count
            if(res.data.item_count === 0){
              document.querySelector('.cart_count').classList.add('hidden');
            }else{
              document.querySelector('.cart_count').textContent = res.data.item_count;
            }
            
            
          });
        });
      });
    
      function updateItemQuantity(key, quantity) {
        axios
          .post('/cart/change.js', {
            id: key,
            quantity,
          })
          .then((res) => {
            const format = document.querySelector('[data-money-format]').getAttribute('data-money-format');
            const totalDiscount = formatMoney(res.data.total_discount, format);
            const totalPrice = formatMoney(res.data.original_total_price,format);
            const subtotalPrice = formatMoney(res.data.total_price,format);
            const item = res.data.items.find((item) => item.key === key);
            const itemPrice = formatMoney(item.final_line_price, format);
    
            document.querySelector(`[data-key = "${key}"] .line-item-price`).textContent = itemPrice;
             document.querySelector('.discount-label').textContent = totalDiscount;
            document.querySelector('.subtotal-label').textContent = subtotalPrice;
             document.querySelector('.totals-label').textContent = totalPrice;
            document.querySelector('.cart_count').textContent = res.data.item_count;
          });
      }
}


async function updateCartDrawer () {
   const res = await fetch('/?section_id=cart-drawer');
   const text = await res.text();
   const html = document.createElement('div');
   html.innerHTML = text;
   const newWrapper = html.querySelector('.drawer__wrapper').innerHTML;
   document.querySelector('.drawer__wrapper').innerHTML = newWrapper;

   addCartDrawerListeners();

}


document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;


    submitButton.textContent = "Adding...";
    

    // Force a reflow
    submitButton.offsetWidth;

    await fetch("/cart/add", {
      method: "post",
      body: new FormData(form),
    });


    //update cart
    await updateCartDrawer();

    submitButton.textContent = "Yayy! Added ✓";

    setTimeout(() => {
        submitButton.textContent = originalButtonText;
    }, '1000');

    
   


    //open cart drawer
    //var drawers = document.querySelectorAll(".drawer");

   // drawers.forEach(function (drawer) {
   //   drawer.classList.add("is-active", "is-visible");
   // });

    //get new cart object
    const res = await fetch("/cart.json");
    const cart = await res.json();


    document.querySelector('.cart_count').classList.remove('hidden');
    document.querySelector('.cart_count').textContent = cart.item_count;
  

  });
});

addCartDrawerListeners();

document.addEventListener("DOMContentLoaded", async () => {
  
  const res = await fetch("/cart.json");
    const cart = await res.json();

    if(cart.item_count != 0){
      document.querySelector('.cart_count').classList.remove('hidden');
    document.querySelector('.cart_count').textContent = cart.item_count;
    }

})
