<template>
    <nav class="navbar navbar-expand-lg sticky-top bg-body-tertiary">
		<div class="container">
			<i class="fa-solid fa-cloud-sun-rain me-2 fs-4 text-primary"></i>
			<a class="navbar-brand fw-bold" href="#">Weather Station</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link to="/" class="nav-link" active-class="active">Measurements</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/charts" class="nav-link" active-class="active">Charts</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/forecasts" class="nav-link" active-class="active">Forecasts</router-link>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>