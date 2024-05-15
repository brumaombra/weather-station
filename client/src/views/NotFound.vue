<template>
    <div class="text-center">
        <i class="fa-solid fa-ghost fs-1 mb-2"></i>
        <h1 class="mb-3">Oops! Wrong Page!</h1>
        <p class="mb-4">You ended up on a page that doesn't exist!<br/>Click the button below to go back to the home.</p>
        <router-link to="/"><button type="button" class="btn custom-blue-background close-navbar d-flex justify-content-center align-items-center m-auto">BACK TO HOME</button></router-link>
    </div>
</template>