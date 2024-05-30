<template>
    <div class="max-w-[50rem] flex flex-col mx-auto size-full">
        <!-- Header -->
        <header class="mb-auto flex justify-center z-50 w-full mt-7">
            <!-- Logo -->
            <div class="flex items-center justify-center text-3xl font-bold text-gray-600">
                Weather Station<i class="fa-solid fa-cloud-sun-rain ms-2 fs-4 text-blue-600"></i>
            </div>
        </header>

        <!-- 404 -->
        <main>
            <div class="text-center py-10 px-4 sm:px-6 lg:px-8">
                <i class="fa-solid fa-ghost text-gray-800 text-7xl mb-2"></i>
                <h1 class="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">404</h1>
                <p class="mt-3 text-gray-600 dark:text-neutral-400 mb-3 font-extrabold">Oops! Wrong Page!</p>
                <p class="text-gray-600 dark:text-neutral-400">You ended up on a page that doesn't exist!<br/>Click the button below to go back to the home.</p>
                <div class="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
                    <router-link to="/">
                        <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-extrabold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            BACK TO HOME
                        </button>
                    </router-link>
                </div>
            </div>
        </main>
    </div>
</template>