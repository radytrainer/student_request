<template>
  <nav class="bg-white-100 p-4 shadow-md">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <img src="@/assets/logo.png" alt="Logo" class="w-20 rounded-full" />
      </div>

      <!-- Links -->
      <ul class="flex space-x-6">
        <li>
          <router-link 
            to="/form" 
            class="hover:underline"
            active-class="font-bold underline text-blue-500"
          >
            New Request
          </router-link>
        </li>
        <li>
          <router-link 
            to="/data" 
            class="hover:underline button"
            active-class="font-bold underline text-blue-500"
          >
            Requested List
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<!-- AKfycbwKHb5Gt6R-o_LLfWKANLa53MN4S2z5XHKQwCGRFm1Tp-DhWQmzTs4U0oSEcJ73H-j7hg -->
 <!-- https://script.google.com/a/macros/passerellesnumeriques.org/s/AKfycbwKHb5Gt6R-o_LLfWKANLa53MN4S2z5XHKQwCGRFm1Tp-DhWQmzTs4U0oSEcJ73H-j7hg/exec -->