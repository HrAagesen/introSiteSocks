Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      },
      sizes: {
          type: Array,
          required: true
      }
    },
    template: `
    <div>
    <ul>
        <li v-for="detail in details">{{ detail }} </li>
    </ul>

    <ul>
        <li v-for="size in sizes">{{ size }}</li>
    </ul>
    </div>
    `
  })

Vue.component('product', {
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }} </p>
                <p>{{ sale }}</p>
                <a v-bind:href="link" target="_blank">More clothes</a>

                <product-details :details="details" :sizes="sizes"></product-details>

                <div v-for="(variant, index) in variants" 
                :key="variant.variantId" 
                class="color-box" 
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
                    
                </div>

                <button v-on:click="addToCart" :disabled="!inStock"
                :class="{ disabledButton: !inStock}"
                >Add to Cart</button>
                <button @click="removeFromCart">Remove from cart</button>

            </div>

            <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p> {{ review.name }} </p>
                    <p>Rating {{ review.rating }} </p>
                    <p> {{ review.review }} </p>
                </li>
            </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>

        </div>`,
        data() {
            return {
                brand: 'Vue Mastery',
                product: 'Socks',
                selectedVariant: 0,
                link: 'https://www.zalando.dk/herrer-home/?&wmc=SEM450_BR_GO._5039605492_2037595824_72680926315.&opc=2211&gclid=Cj0KCQiAkKnyBRDwARIsALtxe7hh7Zprav4E4R45xJ5i-AbEG4NVwE7VV8TmDK8wvDCN1ikR-Xu1DukaAuRPEALw_wcB&gclsrc=aw.ds',
                details: ["80% cotton", "20% polyester", "Gender-neutral"],
                variants: [
                    {
                        variantId: 2234,
                        variantColor: "green",
                        variantImage: "./img/vmSocks-green-onWhite.jpg",
                        variantQuantity: 10
                    },
                    {
                        variantId: 2235,
                        variantColor: "blue",
                        variantImage: "./img/vmSocks-blue-onWhite.jpg",
                        variantQuantity: 0
                    }
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                onSale: true,
                reviews: []
            }
        },
        methods: {
            addToCart: function(){
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            },
            updateProduct: function (index){
                this.selectedVariant = index
                console.log(index)
            },
            removeFromCart: function() {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
           },
           addReview(productReview) {
               this.reviews.push(productReview)
           }
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product
            },
            image() {
                return this.variants[this.selectedVariant].variantImage
            },
            inStock() {
                return this.variants[this.selectedVariant].variantQuantity
            },
            sale() {
                if (this.onSale) {
                  return this.brand + ' ' + this.product + ' are on sale!'
                } 
                  return  this.brand + ' ' + this.product + ' are not on sale'
              },
              shipping() {
                  if (this.premium) {
                      return "Free"
                  }
                  return 2.99
              }
        }

})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
            
        <p>
          <input type="submit" value="Submit">  
        </p>    
      
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation required.")
            }
            }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
              if (this.cart[i] === id) {
                 this.cart.splice(i, 1);
              }
            }
          }
    }
})