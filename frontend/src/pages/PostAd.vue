
<template>
	<main :class="rootClasses">
		<div class="max-w-3xl mx-auto px-6">
			<h1 class="text-5xl font-extrabold leading-tight mb-2">Just 4 steps to complete your ad:</h1>
			<!-- <p class="text-sm text-gray-400 mb-8">Mercedes-Benz S 500, 1st Reg. 01/2026</p> -->

			<div class="space-y-6" v-if="!modalOpen">
				<div v-for="(step, idx) in steps" :key="idx" :class="stepRowClass">
					<button
						class="w-full flex items-start justify-between gap-6 p-6"
						@click="openModal(idx)"
						:aria-expanded="modalOpen && modalActive === idx"
					>
						<div class="flex items-start gap-4">
							<div :class="stepNumberClass">
								{{ idx + 1 }}
							</div>
							<div class="text-left">
								<div :class="stepTitleClass">{{ idx + 1 }}. {{ step.title }}</div>
								<div :class="stepSubtitleClass">{{ step.subtitle }}</div>
							</div>
						</div>

						<div class="flex items-center gap-4">
							<span v-if="completed[idx]" :class="completeFilled">Complete</span>
							<span v-else :class="completeOutline">Complete</span>
						</div>
					</button>
				</div>
			</div>

			<div class="mt-8 text-center" v-if="!modalOpen">
				<button
					:disabled="!allComplete"
					@click="saveAd"
					class="px-12 py-3 rounded-md text-white disabled:opacity-50"
					:class="allComplete ? 'bg-orange-600 hover:bg-orange-500' : 'bg-gray-700 cursor-not-allowed opacity-50'"
				>
					Save
				</button>
			</div>

			<!-- Full-page step view (replaces the page content) -->
			<div v-else class="py-8">
				<div class="text-sm text-gray-400 mb-2">{{ modalActive >= 0 ? (modalActive + 1) + '. ' + steps[modalActive].title : '' }}</div>
				<h2 class="text-4xl font-extrabold leading-tight mb-6">{{ modalSubSteps[subStepIndex] }} <span class="text-orange-500">({{ subStepIndex + 1 }}/{{ modalSubSteps.length }})</span></h2>

				<div>
					<!-- flat sub-step row (no boxed/yellow look) -->
					<div class="flex gap-6 items-center mb-6 text-sm">
						<template v-for="(s, i) in modalSubSteps" :key="i">
							<div class="flex items-center gap-3">
								<div :class="[
									'w-8 h-8 flex items-center justify-center rounded-full text-sm',
									isDark ? (subStepIndex === i ? 'bg-orange-500 text-white' : 'border border-neutral-700 text-neutral-400') : (subStepIndex === i ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-500')
								]">
									{{ i + 1 }}
								</div>
								<div :class="isDark ? (subStepIndex === i ? 'text-gray-100 font-semibold' : 'text-gray-400') : (subStepIndex === i ? 'text-gray-900 font-semibold' : 'text-gray-500')" class="hidden sm:block">
									{{ s }}
								</div>
							</div>
						</template>
					</div>

					<!-- Full-page form content copied from modal -->
					<div>
						<!-- Vehicle step -->
						<div v-if="modalActive === 0">
							<!-- Main Data -->
							<div v-if="subStepIndex === 0" class="space-y-4">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Make</label>
										<div class="relative">
											<select v-model="vehicle.make" :class="inputClass">
												<option value="" disabled>Select make</option>
												<option>Mercedes-Benz</option>
												<option>BMW</option>
												<option>Audi</option>
												<option>Tesla</option>
											</select>
											<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" :stroke="isDark ? '#9CA3AF' : '#374151'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
										<p v-if="errors[0].make" class="text-red-500 text-xs mt-1">{{ errors[0].make }}</p>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Model</label>
										<div class="relative">
											<select v-model="vehicle.model" :class="inputClass">
												<option value="" disabled>Select model</option>
												<option>S 500</option>
												<option>E 350</option>
												<option>A4</option>
											</select>
											<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" :stroke="isDark ? '#9CA3AF' : '#374151'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
										<p v-if="errors[0].model" class="text-red-500 text-xs mt-1">{{ errors[0].model }}</p>
									</div>
								</div>

								<!-- <p :class="isDark ? 'text-xs text-gray-400' : 'text-xs text-gray-600'">To change 'brand' or 'model' you have to <a href="#" class="text-orange-400 underline">create a new ad</a>.</p> -->

								<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>First Registration Date <span class="ml-1 text-xs text-gray-400">i</span></label>
										<div class="flex gap-3 mt-1">
											<select v-model="vehicle.regMonth" :class="inputClass">
												<option value="">Month</option>
												<option v-for="m in months" :key="m" :value="m">{{ m }}</option>
											</select>
											<select v-model="vehicle.regYear" :class="inputClass">
												<option value="">Year</option>
												<option v-for="y in years" :key="y" :value="y">{{ y }}</option>
											</select>
										</div>
										<p v-if="errors[0].year" class="text-red-500 text-xs mt-1">{{ errors[0].year }}</p>
									</div>

									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Category <span class="ml-1 text-xs text-gray-400">i</span></label>
										<div class="relative mt-1">
											<select v-model="vehicle.category" :class="inputClass">
												<option value="">Select category</option>
												<option>Saloon</option>
												<option>SUV</option>
												<option>Coupe</option>
											</select>
											<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" :stroke="isDark ? '#9CA3AF' : '#374151'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Number of doors</label>
										<div class="relative mt-1">
											<select v-model="vehicle.doors" :class="inputClass">
												<option value="">Select</option>
												<option>2/3</option>
												<option>4/5</option>
											</select>
										</div>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Sliding door</label>
										<div class="relative mt-1">
											<select v-model="vehicle.slidingDoor" :class="inputClass">
												<option value="">Please select</option>
												<option>Yes</option>
												<option>No</option>
											</select>
										</div>
									</div>

									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Number of seats</label>
										<input type="number" min="1" v-model.number="vehicle.seats" :class="inputClass" />
									</div>
								</div>
							</div>

							<!-- Engine & environment -->
							<div v-else-if="subStepIndex === 1">
								<div class="mb-6">
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Drive</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Fuel</label>
											<select v-model="vehicle.fuel" :class="inputClass">
												<option value="">Select fuel</option>
												<option>Petrol</option>
												<option>Diesel</option>
												<option>Hybrid</option>
												<option>Electric</option>
												<option>LPG</option>
											</select>
											<p v-if="errors[0].fuel" class="text-red-500 text-xs mt-1">{{ errors[0].fuel }}</p>
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Motor power</label>
											<div class="flex gap-2">
												<input type="number" v-model.number="vehicle.motorPower" :class="inputClass" />
												<select v-model="vehicle.motorPowerUnit" :class="inputClass">
													<option value="kW">kW</option>
													<option value="hp">hp</option>
												</select>
											</div>
										</div>

										<div class="sm:col-span-2">
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Cubic Capacity</label>
											<input v-model="vehicle.cubicCapacity" :class="inputClass" />
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Transmission</label>
											<select v-model="vehicle.transmission" :class="inputClass">
												<option value="">Select</option>
												<option>Automatic</option>
												<option>Manual</option>
											</select>
										</div>

										<div>
											<label class="block text-sm text-transparent">_</label>
											<label class="inline-flex items-center gap-3 cursor-pointer">
												<input type="checkbox" v-model="vehicle.paddleShifters" class="hidden" />
												<div :class="['w-5 h-5 rounded-sm border flex items-center justify-center', vehicle.paddleShifters ? (isDark ? 'bg-purple-600 border-transparent' : 'bg-purple-600 border-transparent') : (isDark ? 'border-neutral-600' : 'border-gray-300')]"></div>
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Paddle shifters</span>
											</label>
										</div>

										<div class="sm:col-span-2">
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Drive type</label>
											<select v-model="vehicle.driveType" :class="inputClass">
												<option value="">Please select</option>
												<option>FWD</option>
												<option>RWD</option>
												<option>AWD/4WD</option>
											</select>
										</div>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Environment & consumption</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Emission Class</label>
											<select v-model="vehicle.emissionClass" :class="inputClass">
												<option value="">Please select</option>
												<option>Euro 6</option>
												<option>Euro 5</option>
											</select>
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Emissions Sticker</label>
											<select v-model="vehicle.emissionSticker" :class="inputClass">
												<option value="">Please select</option>
											</select>
										</div>

										<div class="sm:col-span-2">
											<label class="inline-flex items-center gap-3">
												<input type="checkbox" v-model="vehicle.particulateFilter" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Particulate filter</span>
											</label>
											<label class="inline-flex items-center gap-3 mt-3">
												<input type="checkbox" v-model="vehicle.startStop" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Start-stop system</span>
											</label>
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Fuel consumption (comb.)</label>
											<input type="number" step="0.1" v-model.number="vehicle.fuelConsumptionComb" :class="inputClass" />
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Fuel consumption (urban)</label>
											<input type="number" step="0.1" v-model.number="vehicle.fuelConsumptionUrban" :class="inputClass" />
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Fuel consumption (extra-urban)</label>
											<input type="number" step="0.1" v-model.number="vehicle.fuelConsumptionExtraUrban" :class="inputClass" />
										</div>

										<div class="sm:col-span-2">
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">CO₂ emissions combined</label>
											<input type="number" v-model.number="vehicle.co2Combined" :class="inputClass" />
										</div>
									</div>
								</div>
							</div>

							<!-- Condition & Inspection -->
							<div v-else-if="subStepIndex === 2" class="space-y-6">
								<h3 :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'">Vehicle history</h3>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Mileage</label>
										<div class="flex items-center">
											<input type="number" v-model.number="vehicle.mileage" :class="inputClass" />
											<span class="ml-3 text-sm text-gray-400">km</span>
										</div>
										<p v-if="errors[0].mileage" class="text-red-500 text-xs mt-1">{{ errors[0].mileage }}</p>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Subcategory</label>
										<select v-model="vehicle.subcategory" :class="inputClass">
											<option value="">Select</option>
											<option>Used vehicle</option>
											<option>New vehicle</option>
										</select>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Number of Vehicle Owners</label>
										<select v-model="vehicle.owners" :class="inputClass">
											<option value="">Please select</option>
											<option>1</option>
											<option>2</option>
											<option>3+</option>
										</select>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'"><span class="text-red-500 mr-1">*</span>Damaged Vehicle</label>
										<select v-model="vehicle.damaged" :class="inputClass">
											<option value="">Please select</option>
											<option>Yes</option>
											<option>No</option>
										</select>
										<p v-if="errors[0].damaged" class="text-red-500 text-xs mt-1">{{ errors[0].damaged }}</p>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Accident-damaged vehicle</label>
										<select v-model="vehicle.accidentDamaged" :class="inputClass">
											<option value="">Please select</option>
										</select>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Roadworthy</label>
										<select v-model="vehicle.roadworthy" :class="inputClass">
											<option value="">Please select</option>
											<option>Yes</option>
											<option>No</option>
										</select>
									</div>

									<div class="sm:col-span-2">
										<label class="inline-flex items-center gap-3">
											<input type="checkbox" v-model="vehicle.nonSmoking" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Non-smoking vehicle</span>
										</label>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<h3 :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'">Service and maintenance</h3>
								<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">General inspection valid until</label>
										<div class="flex gap-3 mt-1">
											<select v-model="vehicle.inspectionMonth" :class="inputClass">
												<option value="">Month</option>
												<option v-for="m in months" :key="m" :value="m">{{ m }}</option>
											</select>
											<select v-model="vehicle.inspectionYear" :class="inputClass">
												<option value="">Year</option>
												<option v-for="y in years" :key="y" :value="y">{{ y }}</option>
											</select>
										</div>
									</div>

									<div class="sm:col-span-2">
										<label class="block text-sm text-gray-600 mb-2">Service options</label>
										<label class="inline-flex items-center gap-3 mt-2">
											<input type="checkbox" v-model="vehicle.fullServiceHistory" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Full Service History</span>
										</label>
										<label class="inline-flex items-center gap-3 mt-2">
											<input type="checkbox" v-model="vehicle.warranty" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Warranty/Factory Warranty</span>
										</label>
									</div>
								</div>
							</div>

							<div v-else class="grid grid-cols-1 gap-4">
								<div>
									<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Condition notes</label>
									<textarea v-model="vehicle.conditionNotes" rows="3" :class="textareaClass"></textarea>
								</div>
								<div>
									<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Inspection date</label>
									<input type="date" v-model="vehicle.inspectionDate" :class="inputClass" />
								</div>
							</div>
						</div>

						<!-- Equipment step -->
						<div v-else-if="modalActive === 1">
							<!-- Colour & Interior -->
							<div v-if="subStepIndex === 0" class="space-y-6">
								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Exterior Colour</h3>
									<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
										<template v-for="(c, idx) in colorOptions" :key="c.name">
											<button type="button" @click.prevent="toggleColor(c.name)" :aria-pressed="equipment.colors.includes(c.name)"
												:class="['flex items-center gap-3 px-3 py-2 rounded-md border', equipment.colors.includes(c.name) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
												<span :style="{ background: c.hex }" class="w-8 h-8 rounded-full block overflow-hidden flex-shrink-0 border" :class="isDark ? 'border-neutral-700' : 'border-gray-200'"></span>
												<span class="text-sm">{{ c.label }}</span>
											</button>
										</template>

										<!-- Metallic as a grid item so it matches color button sizing -->
										<button type="button" @click.prevent="equipment.metallic = !equipment.metallic" :aria-pressed="equipment.metallic"
											:class="['flex items-center gap-3 px-4 py-3 rounded-md border', equipment.metallic ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-900') ]">
											<input type="checkbox" class="pointer-events-none w-5 h-5" :checked="equipment.metallic" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Metallic</span>
										</button>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Interior Design</h3>
									<div class="text-sm text-gray-500 mb-2">Material</div>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
										<template v-for="m in materialOptions" :key="m">
											<button type="button" @click.prevent="toggleMaterial(m)" :class="['w-full text-left p-3 rounded-md border flex items-center gap-3', equipment.materials.includes(m) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-100') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
												<input type="checkbox" class="pointer-events-none w-4 h-4" :checked="equipment.materials.includes(m)" />
												<span>{{ m }}</span>
											</button>
										</template>
									</div>

								<div class="mt-4">
									<div class="text-sm text-gray-500 mb-2">Colour</div>
									<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
										<template v-for="(c, i) in colorOptions.slice(0,8)" :key="'int-'+i">
											<button type="button" @click.prevent="equipment.interiorColor = c.name" :class="['flex items-center gap-3 px-3 py-2 rounded-md border', equipment.interiorColor === c.name ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
												<span class="w-8 h-8 rounded-full block overflow-hidden flex-shrink-0 border" :style="{ background: c.hex }" :class="isDark ? 'border-neutral-700' : 'border-gray-200'"></span>
												<span class="text-sm">{{ c.label }}</span>
											</button>
										</template>
										<button type="button" @click.prevent="equipment.interiorColor = 'other'" :class="['flex items-center gap-3 px-3 py-2 rounded-md border', equipment.interiorColor === 'other' ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
											<span class="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 border"></span>
											<span class="text-sm">Other</span>
										</button>
									</div>
								</div>
								</div>
							</div>

							<!-- Safety -->
							<div v-else-if="subStepIndex === 1" class="space-y-6">
								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Assistance systems</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<template v-for="opt in safetyOptions" :key="opt">
											<button type="button" @click.prevent="toggleSafety(opt)" :aria-pressed="equipment.safetyFeatures.includes(opt)"
												:class="['text-left p-3 rounded-md border flex items-center gap-3', equipment.safetyFeatures.includes(opt) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
												<input type="checkbox" class="pointer-events-none w-4 h-4" :checked="equipment.safetyFeatures.includes(opt)" />
												<span class="text-sm">{{ opt }}</span>
											</button>
										</template>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Cruise control</label>
										<div class="mt-1">
											<select v-model="equipment.cruise" :class="inputClass">
												<option v-for="c in cruiseOptions" :key="c" :value="c">{{ c }}</option>
											</select>
										</div>
									</div>

									<div>
										<label class="block text-sm text-gray-500">Speed assistance</label>
										<div class="flex gap-3 mt-2">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.speedLimitControl" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Speed limit control</span>
											</label>
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.distanceWarning" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Distance warning</span>
											</label>
										</div>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Occupant protection</h3>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Airbags</label>
											<select v-model="equipment.airbags" :class="inputClass">
												<option value="">Please select</option>
												<option>Front</option>
												<option>Front + Side</option>
												<option>Full set</option>
											</select>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.isofix" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">ISOFIX</span>
											</label>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.passengerIsofix" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Passenger ISOFIX</span>
											</label>
										</div>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Light & sight</h3>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Headlight type</label>
											<select v-model="equipment.headlightType" :class="inputClass">
												<option value="">Please select</option>
												<option>Halogen</option>
												<option>LED</option>
												<option>Matrix LED</option>
											</select>
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Daytime running</label>
											<select v-model="equipment.daytimeRunning" :class="inputClass">
												<option v-for="d in daytimeOptions" :key="d" :value="d">{{ d }}</option>
											</select>
										</div>

										<div>
											<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Adaptive lighting</label>
											<select v-model="equipment.adaptiveLighting" :class="inputClass">
												<option v-for="a in adaptiveOptions" :key="a" :value="a">{{ a }}</option>
											</select>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.headlightWasher" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Headlight washer</span>
											</label>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.glareFreeHighBeam" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Glare-free high beam</span>
											</label>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.highBeamAssist" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">High beam assist</span>
											</label>
										</div>

										<div class="flex items-center gap-4">
											<label class="inline-flex items-center gap-2">
												<input type="checkbox" v-model="equipment.fogLamps" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Fog lights</span>
											</label>
										</div>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Theft protection</h3>
									<div class="flex gap-6">
										<label class="inline-flex items-center gap-2">
											<input type="checkbox" v-model="equipment.alarmSystem" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Alarm system</span>
										</label>
										<label class="inline-flex items-center gap-2">
											<input type="checkbox" v-model="equipment.engineImmobilizer" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Engine immobilizer</span>
										</label>
									</div>
								</div>
							</div>

							<!-- Comfort -->
							<div v-else-if="subStepIndex === 2" class="space-y-6">
								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Climate Control</h3>
									<div>
										<select v-model="equipment.climatization" :class="inputClass">
											<option v-for="c in climatizationOptions" :key="c" :value="c">{{ c }}</option>
										</select>
										<div class="mt-3 space-y-2">
											<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border" :class="isDark ? 'border-neutral-700' : 'border-gray-200'">
												<input type="checkbox" v-model="equipment.auxiliaryHeating" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Auxiliary heating</span>
											</label>
											<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border" :class="isDark ? 'border-neutral-700' : 'border-gray-200'">
												<input type="checkbox" v-model="equipment.heatedWindshield" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Heated windshield</span>
											</label>
											<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border" :class="isDark ? 'border-neutral-700' : 'border-gray-200'">
												<input type="checkbox" v-model="equipment.heatedSteeringWheel" class="mr-2" />
												<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Heated steering wheel</span>
											</label>
										</div>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Parking sensors</h3>
									<div class="space-y-3">
										<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border" :class="isDark ? 'border-neutral-700' : 'border-gray-200'">
											<input type="checkbox" v-model="equipment.parkingSelfSteering" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Self-steering systems</span>
										</label>

										<div class="mt-2 grid grid-cols-2 gap-3">
											<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border text-sm" :class="equipment.acousticFront ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" v-model="equipment.acousticFront" class="mr-2" />
												Front
											</label>
											<label class="inline-flex items-center gap-3 w-full p-3 rounded-md border text-sm" :class="equipment.acousticRear ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" v-model="equipment.acousticRear" class="mr-2" />
												Rear
											</label>
										</div>

										<div class="mt-4">
											<div class="text-sm text-gray-500 mb-2">Visual parking assistant</div>
											<div class="grid grid-cols-2 gap-3">
												<button type="button" @click.prevent="equipment.visualCamera = !equipment.visualCamera" :class="['p-3 rounded-md border text-left', equipment.visualCamera ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
													<input type="checkbox" class="pointer-events-none mr-2" :checked="equipment.visualCamera" />
													Camera
												</button>
												<button type="button" @click.prevent="equipment.visual360 = !equipment.visual360" :class="['p-3 rounded-md border text-left', equipment.visual360 ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700') ]">
													<input type="checkbox" class="pointer-events-none mr-2" :checked="equipment.visual360" />
													360° camera
												</button>
											</div>
										</div>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Seats</h3>
									<div class="mb-3">
										<div class="text-sm text-gray-500 mb-2">Heated seats</div>
										<div class="grid grid-cols-2 gap-3">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.heatedSeats.includes('Front') ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.heatedSeats.includes('Front')" @change="toggleArray('heatedSeats','Front')" class="mr-2" />
												<span>Front</span>
											</label>
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.heatedSeats.includes('Back') ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.heatedSeats.includes('Back')" @change="toggleArray('heatedSeats','Back')" class="mr-2" />
												<span>Back</span>
											</label>
										</div>
									</div>

									<div class="mb-3">
										<div class="text-sm text-gray-500 mb-2">Electric adjustable seats</div>
										<div class="grid grid-cols-2 gap-3">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.electricSeats.includes('Front') ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.electricSeats.includes('Front')" @change="toggleArray('electricSeats','Front')" class="mr-2" />
												<span>Front</span>
											</label>
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.electricSeats.includes('Back') ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.electricSeats.includes('Back')" @change="toggleArray('electricSeats','Back')" class="mr-2" />
												<span>Back</span>
											</label>
										</div>
									</div>

									<div class="mb-3">
										<div class="text-sm text-gray-500 mb-2">Other features</div>
										<div class="grid grid-cols-1 gap-3">
											<template v-for="f in seatFeatureOptions" :key="f">
												<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.seatFeatures.includes(f) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
													<input type="checkbox" :checked="equipment.seatFeatures.includes(f)" @change="toggleArray('seatFeatures', f)" class="mr-2" />
													<span>{{ f }}</span>
												</label>
											</template>
										</div>
									</div>
								</div>

								<hr :class="isDark ? 'border-neutral-700' : 'border-gray-200'" />

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Other comfort equipment</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<template v-for="c in otherComfortOptions" :key="c">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.otherComfort.includes(c) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.otherComfort.includes(c)" @change="toggleArray('otherComfort', c)" class="mr-2" />
												<span>{{ c }}</span>
											</label>
										</template>
									</div>
								</div>
							</div>

							<!-- Infotainment -->
							<div v-else-if="subStepIndex === 3" class="space-y-6">
								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Multimedia</h3>
									<div class="grid grid-cols-1 gap-3">
										<template v-for="m in multimediaOptions" :key="m">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.infotainmentFeatures.includes(m) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.infotainmentFeatures.includes(m)" @change="toggleArray('infotainmentFeatures', m)" class="w-4 h-4" />
												<span>{{ m }}</span>
											</label>
										</template>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Handling and control</h3>
									<div class="grid grid-cols-1 gap-3">
										<template v-for="h in handlingControlOptions" :key="h">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.infotainmentFeatures.includes(h) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.infotainmentFeatures.includes(h)" @change="toggleArray('infotainmentFeatures', h)" class="w-4 h-4" />
												<span>{{ h }}</span>
											</label>
										</template>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Connectivity and interfaces</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<template v-for="c in connectivityOptions" :key="c">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.infotainmentFeatures.includes(c) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.infotainmentFeatures.includes(c)" @change="toggleArray('infotainmentFeatures', c)" class="w-4 h-4" />
												<span>{{ c }}</span>
											</label>
										</template>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Cockpit display</h3>
									<div class="grid grid-cols-1 gap-3">
										<template v-for="d in cockpitOptions" :key="d">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.infotainmentFeatures.includes(d) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.infotainmentFeatures.includes(d)" @change="toggleArray('infotainmentFeatures', d)" class="w-4 h-4" />
												<span>{{ d }}</span>
											</label>
										</template>
									</div>
								</div>
							</div>

							<!-- Extras -->
							<div v-else-if="subStepIndex === 4" class="space-y-6">
								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Tires and rims</h3>
									<div class="grid grid-cols-1 gap-3">
										<template v-for="t in tiresOptions" :key="t">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.tires.includes(t) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.tires.includes(t)" @change="toggleArray('tires', t)" class="w-4 h-4" />
												<span>{{ t }}</span>
											</label>
										</template>
									</div>
								</div>

								<div>
									<label :class="isDark ? 'block text-sm text-gray-400 mb-2' : 'block text-sm text-gray-600 mb-2'">Breakdown service</label>
									<select v-model="equipment.breakdownService" :class="inputClass">
										<option v-for="b in breakdownOptions" :key="b" :value="b">{{ b }}</option>
									</select>
									<div class="mt-3">
										<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.tirePressureMonitoring ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
											<input type="checkbox" v-model="equipment.tirePressureMonitoring" class="mr-2" />
											<span :class="isDark ? 'text-gray-100' : 'text-gray-900'">Tyre pressure monitoring</span>
										</label>
									</div>
								</div>

								<div>
									<h3 :class="isDark ? 'text-sm text-gray-400 mb-3' : 'text-sm text-gray-600 mb-3'">Special features</h3>
									<div class="grid grid-cols-1 gap-3">
										<template v-for="s in specialFeaturesOptions" :key="s">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.extrasFeatures.includes(s) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.extrasFeatures.includes(s)" @change="toggleArray('extrasFeatures', s)" class="w-4 h-4" />
												<span>{{ s }}</span>
											</label>
										</template>
									</div>
								</div>

								<div>
									<label :class="isDark ? 'block text-sm text-gray-400 mb-2' : 'block text-sm text-gray-600 mb-2'">Trailer coupling</label>
									<select v-model="equipment.trailerCoupling" :class="inputClass">
										<option v-for="tr in trailerOptions" :key="tr" :value="tr">{{ tr }}</option>
									</select>
									<div class="mt-3 grid grid-cols-1 gap-3">
										<template v-for="e in extrasMiscOptions" :key="e">
											<label class="inline-flex items-center gap-3 p-3 rounded-md border cursor-pointer" :class="equipment.extrasFeatures.includes(e) ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
												<input type="checkbox" :checked="equipment.extrasFeatures.includes(e)" @change="toggleArray('extrasFeatures', e)" class="w-4 h-4" />
												<span>{{ e }}</span>
											</label>
										</template>
									</div>
								</div>
							</div>
						</div>

						<!-- Details step -->
						<div v-else-if="modalActive === 2">
							<!-- Title & description -->
							<div v-if="subStepIndex === 0">
								<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Highlight</label>
								<input v-model="details.title" :class="inputClass" maxlength="27" placeholder="Brief highlight (e.g. 'Low mileage, one owner')" />
								<div class="text-xs mt-1 text-gray-500">{{ (details.title || '').length }} / 27</div>
								<p v-if="errors[2].title" class="text-red-500 text-xs mt-1">{{ errors[2].title }}</p>
								<p :class="isDark ? 'text-sm text-gray-400 mt-2' : 'text-sm text-gray-600 mt-2'">Highlight will appear below the title of the ad and should contain the most important features of the car.</p>
								<label :class="isDark ? 'block text-sm text-gray-300 mt-3' : 'block text-sm text-gray-600 mt-3'">Vehicle description</label>
								<textarea v-model="details.description" rows="4" :class="textareaClass" placeholder="We recommend providing a detailed description that highlights all benefits of your vehicle."></textarea>
							</div>

							<!-- Price -->
							<div v-else-if="subStepIndex === 1">
								<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Price</label>
								<div class="flex items-center gap-4 mt-2">
									<div class="relative w-full max-w-sm">
										<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ details.currency }}</span>
										<input type="text" v-model="details.price" inputmode="numeric" pattern="[0-9]*" @input="details.price = String(details.price).replace(/[^0-9.]/g, '')" :class="[inputClass, 'pl-10']" placeholder="0" />
									</div>
									<select v-model="details.priceType" :class="[inputClass, 'w-48']">
										<option>Fixed</option>
										<option>Negotiable</option>
										<option>On request</option>
									</select>
								</div>
								<p v-if="errors[2].price" class="text-red-500 text-xs mt-1">{{ errors[2].price }}</p>
							</div>

							<!-- Pictures & video -->
							<div v-else>
								<div class="flex items-center justify-between">
									<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Images</label>
									<div :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-500'">(max. 10 MB per Picture)</div>
								</div>
								<p v-if="errors[2].images" class="text-red-500 text-xs mt-1">{{ errors[2].images }}</p>

								<input ref="fileInput" type="file" accept="image/*" multiple @change="onFilesSelected" class="hidden" />

								<!-- Upload photo box -->
								<div
									@click.prevent="triggerFileInput"
									@dragover.prevent="areaDrag = true"
									@dragleave.prevent="areaDrag = false"
									@drop.prevent="handleAreaDrop"
									:class="['mt-3 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-44 cursor-pointer', uploaderBgClass, areaDrag ? 'ring-2 ring-blue-400' : '']">
									<i class="pi pi-camera text-4xl text-blue-400 mb-2"></i>
									<div class="font-normal text-sm">add using drag & drop or...</div>
									<button type="button" @click.stop="triggerFileInput" :class="['mt-3 px-5 py-2 text-md border-2 border-blue-400 rounded-md cursor-pointer', selectBtnClass]">Select images</button>
								</div>

								<!-- Photos grid -->
								<div class="mt-4 flex items-center justify-between">
									<h2 :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Uploaded Photos</h2>
									<div class="text-sm text-gray-400">{{ form.images.length }} / 9</div>
								</div>

								<div class="mt-3 grid grid-cols-3 gap-3">
									<div v-for="i in 9" :key="i" class="w-full rounded-md overflow-hidden">
										<div class="w-full relative" style="padding-top:75%" @dragover.prevent="onDragOver(i-1,$event)" @drop.prevent="onDrop(i-1,$event)" :class="dragOverIndex===i-1 ? 'ring-2 ring-blue-400' : ''">
											<template v-if="form.images[i-1]">
												<img draggable="true" @dragstart="onDragStart(i-1,$event)" @dragend="onDragEnd" :src="form.images[i-1]" class="absolute inset-0 w-full h-full object-cover" />
												<div class="absolute top-1 right-1">
													<button @click.prevent="removeImage(i-1)" :class="['px-2 py-1 text-xs rounded', removeBtnColorClass]">Remove</button>
												</div>
											</template>
											<template v-else>
												<div :class="['absolute inset-0 rounded-md flex items-center justify-center text-blue-500 border-2 border-dashed', placeholderBorderClass]">
													<div class="placeholder-icon w-full h-full flex items-center justify-center">
														<i class="pi pi-image placeholder-icon-svg text-blue-500 opacity-20 text-6xl"></i>
													</div>
												</div>
											</template>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Contact step -->
						<div v-else-if="modalActive === 3">
							<!-- Name -->
							<div v-if="subStepIndex === 0" class="space-y-4">
								<div>
									<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Form of Address</label>
									<select v-model="contact.formOfAddress" :class="inputClass">
										<option value="">Please select</option>
										<option>Mr</option>
										<option>Ms</option>
										<option>Company</option>
									</select>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">First Name <span class="text-red-500">*</span></label>
										<input v-model="contact.firstName" :class="inputClass" />
										<p v-if="errors[3].firstName" class="text-red-500 text-xs mt-1">{{ errors[3].firstName }}</p>
									</div>
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Last Name <span class="text-red-500">*</span></label>
										<input v-model="contact.lastName" :class="inputClass" />
										<p v-if="errors[3].lastName" class="text-red-500 text-xs mt-1">{{ errors[3].lastName }}</p>
									</div>
								</div>

								<div>
									<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Should your name be displayed in the ad? <span class="text-red-500">*</span></label>
									<div class="mt-3 grid gap-3">
										<label class="flex items-start gap-3 p-3 rounded-md border cursor-pointer" :class="contact.displayName === 'no' ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
											<input type="radio" v-model="contact.displayName" value="no" class="mt-1 mr-3" />
											<div>
												<div class="font-medium">No</div>
												<div class="text-sm text-gray-400">Displayed: Private seller</div>
											</div>
										</label>

										<label class="flex items-start gap-3 p-3 rounded-md border cursor-pointer" :class="contact.displayName === 'yes' ? (isDark ? 'border-purple-600 bg-purple-700 text-white' : 'border-orange-600 bg-orange-50 text-gray-900') : (isDark ? 'border-neutral-700 text-gray-100' : 'border-gray-200 text-gray-700')">
											<input type="radio" v-model="contact.displayName" value="yes" class="mt-1 mr-3" />
											<div>
												<div class="font-medium">Yes</div>
											</div>
										</label>
									</div>
									<p v-if="errors[3].displayName" class="text-red-500 text-xs mt-1">{{ errors[3].displayName }}</p>
								</div>
							</div>

							<!-- Address -->
							<div v-else-if="subStepIndex === 1" class="space-y-4">
								<p :class="isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'">Your address is required to publish the ad. Only postcode and city are displayed in the ad so buyers can estimate distance to the vehicle.</p>

								<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Street <span class="text-red-500">*</span></label>
										<input v-model="contact.street" :class="inputClass" />
										<p v-if="errors[3].street" class="text-red-500 text-xs mt-1">{{ errors[3].street }}</p>
									</div>
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">No. <span class="text-red-500">*</span></label>
										<input v-model="contact.number" :class="inputClass" />
										<p v-if="errors[3].number" class="text-red-500 text-xs mt-1">{{ errors[3].number }}</p>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 items-center">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">Zip <span class="text-red-500">*</span></label>
										<input v-model="contact.zip" :class="inputClass" />
										<p v-if="errors[3].zip" class="text-red-500 text-xs mt-1">{{ errors[3].zip }}</p>
									</div>
									<div class="sm:col-span-2">
										<label :class="isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-600'">City <span class="text-red-500">*</span></label>
										<input v-model="contact.city" :class="inputClass" />
										<p v-if="errors[3].city" class="text-red-500 text-xs mt-1">{{ errors[3].city }}</p>
									</div>
								</div>

								<div>
									<label :class="isDark ? 'block text-sm text-gray-300 mb-2' : 'block text-sm text-gray-600 mb-2'">Country</label>
									<select v-model="contact.country" :class="inputClass">
										<option>Romania</option>
										<option>Germany</option>
										<option>France</option>
										<option>Spain</option>
									</select>
								</div>

								<div class="mt-10 p-4 rounded-md border" :class="isDark ? 'bg-gray-800 border-neutral-700 text-gray-200' : 'bg-white border-gray-300 text-gray-700'">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 rounded-full flex items-center justify-center text-blue-500" :class="isDark ? 'text-blue-500' : ''"><i class="pi pi-shield text-2xl"></i></div>
										<div class="text-sm">To protect your privacy, the ad will only display your postcode and location.</div>
									</div>
								</div>
							</div>

							<!-- Phone number -->
							<div v-else-if="subStepIndex === 2">
								<div class="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
									<div>
										<label :class="isDark ? 'block text-sm text-gray-300 mb-2' : 'block text-sm text-gray-600 mb-2'">Country code</label>
										<select v-model="contact.countryCode" :class="[inputClass]">
											<option v-for="c in countryCodeOptions" :key="c" :value="c">{{ c }}</option>
										</select>
									</div>

									<div>
										<label :class="isDark ? 'block text-sm text-gray-300 mb-2' : 'block text-sm text-gray-600 mb-2'"><span class="text-red-500">*</span> Phone number</label>
										<input v-model="contact.phone" :class="[inputClass]" />
										<p v-if="errors[3].phone" class="text-red-500 text-xs mt-1">{{ errors[3].phone }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-between items-center">
					<a href="#" @click.prevent="handleBack" class="text-sm text-gray-400">Back</a>
					<div>
						<button v-if="subStepIndex < modalSubSteps.length - 1" @click="nextSub" class="px-6 py-2 bg-orange-600 text-white rounded-md">Continue</button>
						<button v-else @click="saveStepFromModal" class="px-6 py-2 bg-orange-600 text-white rounded-md">Continue</button>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
	import { ref, reactive, computed, nextTick } from 'vue'
	import { useTheme } from '../composables/useTheme'

	const steps = [
		{ title: 'Vehicle data', subtitle: 'Main data, Engine & environment, Condition & Inspection' },
		{ title: 'Equipment', subtitle: 'Colour & Interior, Safety, Comfort, Infotainment, Extras' },
		{ title: 'Details', subtitle: 'Pictures & video, Title & description, Price' },
		{ title: 'Contact', subtitle: 'Name, Address, Phone number' }
	]

	const modalOpen = ref(false)
	const modalActive = ref(-1)
	const subStepIndex = ref(0)
	const completed = ref([false, false, false, false])

	const vehicle = reactive({ make: '', model: '', year: '', regMonth: '', regYear: '', regDate: '', mileage: '', engine: '', fuel: '', transmission: '', emission: '', conditionNotes: '', inspectionDate: '', category: '', doors: '', slidingDoor: '', seats: '', motorPower: null, motorPowerUnit: 'kW', cubicCapacity: '', paddleShifters: false, driveType: '', emissionClass: '', emissionSticker: '', particulateFilter: false, startStop: false, fuelConsumptionComb: null, fuelConsumptionUrban: null, fuelConsumptionExtraUrban: null, co2Combined: null, subcategory: '', owners: '', damaged: '', accidentDamaged: '', roadworthy: '', nonSmoking: false, inspectionMonth: '', inspectionYear: '', fullServiceHistory: false, warranty: false })
	const equipment = reactive({
		// colour / interior
		colors: [], metallic: false, interiorColor: '', materials: [],
		// general equipment groups
		safety: '', comfort: '', infotainment: '', extras: '',

		// Safety-specific
		safetyFeatures: [],
		cruise: '',
		speedLimitControl: false,
		distanceWarning: false,
		airbags: '',
		isofix: false,
		passengerIsofix: false,
		headlightType: '',
		headlightWasher: false,
		glareFreeHighBeam: false,
		highBeamAssist: false,
		daytimeRunning: '',
		adaptiveLighting: '',
		fogLamps: false,
		alarmSystem: false,
		engineImmobilizer: false,

		// Comfort-specific
		climatization: '',
		auxiliaryHeating: false,
		heatedWindshield: false,
		heatedSteeringWheel: false,
		parkingSelfSteering: false,
		acousticFront: false,
		acousticRear: false,
		visualCamera: false,
		visual360: false,

		// Seats
		heatedSeats: [],
		electricSeats: [],
		seatFeatures: [],

		// Other comfort equipment
		otherComfort: [],
		// Infotainment
		infotainmentFeatures: [],
		// Extras
		tires: [],
		breakdownService: '',
		tirePressureMonitoring: false,
		extrasFeatures: [],
		trailerCoupling: '',
		lightSensor: false,
		rainSensor: false,
		powerAssistedSteering: false,
		ambientLighting: false,
		leatherSteeringWheel: false,
		electricWindows: false,
		electricSideMirror: false,
		electricTailgate: false,
		centralLocking: false,
		keylessCentralLocking: false
	})

	const safetyOptions = [
		'Antilock braking system (ABS)',
		'Electronic stability program (ESP)',
		'Traction control (ASR)',
		'Hill-start assist',
		'Fatigue warning system',
		'Lane change assist',
		'Blind spot assist',
		'Automatic dimming interior mirror',
		'Night vision assist',
		'Emergency brake assist',
		'Emergency call system',
		'Traffic sign recognition'
	]

	const cruiseOptions = ['Please select','Adaptive cruise control','Cruise control']
	const daytimeOptions = ['Please select','Daytime running lights','Daytime running LED']
	const adaptiveOptions = ['Please select','Yes','No']

	// Extras options
	const tiresOptions = ['Alloy wheels','Summer tyres','Winter tyres','All season tyres']
	const breakdownOptions = ['Please select','No breakdown service','Europe-wide','Worldwide']
	const specialFeaturesOptions = ['Winter package','Smoker\'s package','Sports package','Sports suspension','Air suspension']
	const trailerOptions = ['Please select','No coupling','Fixed coupling','Detachable coupling']
	const extrasMiscOptions = ['Cargo barrier','Ski bag','Sunroof','Panoramic roof','Roof rack','Disabled accessible','Taxi']

	function toggleSafety(name) {
		const i = equipment.safetyFeatures.indexOf(name)
		if (i === -1) equipment.safetyFeatures.push(name)
		else equipment.safetyFeatures.splice(i, 1)
	}

	// Comfort helpers/options
	const climatizationOptions = [
		'Please select',
		'Manual climatization',
		'Automatic climatization, 1 zone',
		'Automatic climatization, 2 zones',
		'Automatic climatization, 3 zones'
	]

	const seatFeatureOptions = ['Sport seats','Arm rest','Lumbar support','Massage seats','Seat ventilation','Fold flat passenger seat']

	const otherComfortOptions = [
		'Electric windows','Electric side mirror','Electric tailgate','Central locking','Keyless central locking',
		'Light sensor','Rain sensor','Power Assisted Steering','Ambient lighting','Leather steering wheel'
	]

	function toggleArray(key, value) {
		const arr = equipment[key]
		if (!Array.isArray(arr)) return
		const idx = arr.indexOf(value)
		if (idx === -1) arr.push(value)
		else arr.splice(idx, 1)
	}

	// Infotainment options
	const multimediaOptions = ['Tuner/radio','DAB radio','CD player','TV','Navigation system','Sound system']
	const handlingControlOptions = ['Touchscreen','Voice control','Multifunction steering wheel','Hands-free kit']
	const connectivityOptions = ['USB port','Bluetooth','Apple CarPlay','Android Auto','WLAN / Wi-Fi hotspot','Integrated music streaming','Induction charging for smartphones']
	const cockpitOptions = ['On-board computer','Head-up display','Digital cockpit']

	const colorOptions = [
		{ name: 'beige', label: 'Beige', hex: '#E6CFA6' },
		{ name: 'gold', label: 'Gold', hex: '#D1A12B' },
		{ name: 'purple', label: 'Purple', hex: '#9B6BFF' },
		{ name: 'yellow', label: 'Yellow', hex: '#FFD24A' },
		{ name: 'black', label: 'Black', hex: '#2D2D2D' },
		{ name: 'green', label: 'Green', hex: '#5DB75D' },
		{ name: 'red', label: 'Red', hex: '#E04A47' },
		{ name: 'blue', label: 'Blue', hex: '#2B6DF6' },
		{ name: 'grey', label: 'Grey', hex: '#9CA3AF' },
		{ name: 'silver', label: 'Silver', hex: '#CFCFCF' },
		{ name: 'brown', label: 'Brown', hex: '#8B5E3C' },
		{ name: 'orange', label: 'Orange', hex: '#F59E0B' }
	]

	const materialOptions = ['Alcantara','Cloth','Full leather','Imitation leather','Other','Part leather','Velour']

	function toggleColor(name){
		// make exterior colours single-select (like interiorColor)
		if (equipment.colors.length === 1 && equipment.colors[0] === name) {
			equipment.colors = []
		} else {
			equipment.colors = [name]
		}
	}

	function toggleMaterial(name){
		// single-select materials (behave like radio)
		if (equipment.materials.length === 1 && equipment.materials[0] === name) {
			equipment.materials = []
		} else {
			equipment.materials = [name]
		}
	}
	const details = reactive({ title: '', description: '', price: null, images: [], priceType: 'Fixed', currency: '€' })
	const contact = reactive({ formOfAddress: '', firstName: '', lastName: '', phone: '', countryCode: '+49 (DE)', displayName: '', street: '', number: '', zip: '', city: '', country: 'Romania' })

	const countryCodeOptions = [
		'+1 (US)', '+1 (CA)', '+7 (RU)', '+20 (EG)', '+27 (ZA)', '+30 (GR)', '+31 (NL)', '+32 (BE)', '+33 (FR)', '+34 (ES)', '+36 (HU)', '+39 (IT)', '+40 (RO)', '+41 (CH)', '+43 (AT)', '+44 (GB)', '+45 (DK)', '+46 (SE)', '+47 (NO)', '+48 (PL)', '+49 (DE)', '+52 (MX)', '+55 (BR)', '+64 (NZ)', '+81 (JP)', '+82 (KR)', '+90 (TR)', '+212 (MA)', '+216 (TN)', '+234 (NG)', '+251 (ET)', '+298 (FO)', '+351 (PT)', '+352 (LU)', '+353 (IE)', '+354 (IS)', '+355 (AL)', '+356 (MT)', '+357 (CY)', '+358 (FI)', '+359 (BG)', '+370 (LT)', '+371 (LV)', '+372 (EE)', '+373 (MD)', '+375 (BY)', '+376 (AD)', '+377 (MC)', '+378 (SM)', '+380 (UA)', '+381 (RS)', '+382 (ME)', '+385 (HR)', '+386 (SI)', '+387 (BA)', '+389 (MK)', '+420 (CZ)', '+421 (SK)', '+423 (LI)', '+886 (TW)', '+961 (LB)', '+962 (JO)', '+965 (KW)', '+966 (SA)', '+968 (OM)', '+971 (AE)', '+972 (IL)', '+253 (DJ)', '+254 (KE)', '+256 (UG)', '+260 (ZM)', '+263 (ZW)'
	]

	const errors = reactive([{}, {}, {}, {}])

	// small helpers for selects
	const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: (currentYear - 1980 + 1) }, (_, i) => String(currentYear - i))

	// Theme handling (light/dark)
	const { theme } = useTheme()
	const prefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	const isDark = computed(() => theme.value === 'dark' || (theme.value === 'system' && prefersDark()))

	const rootClasses = computed(() => [
		'min-h-screen',
		'py-12',
		isDark.value ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
	].join(' '))

	const stepRowClass = computed(() => isDark.value ? 'py-6 border-b border-neutral-800' : 'py-6 border-b border-gray-200')
	const stepTitleClass = computed(() => isDark.value ? 'text-2xl font-semibold text-gray-100' : 'text-2xl font-semibold text-gray-900')
	const stepSubtitleClass = computed(() => isDark.value ? 'text-sm text-gray-400 mt-1' : 'text-sm text-gray-600 mt-1')
	const stepNumberClass = computed(() => isDark.value ? 'flex items-center justify-center w-12 h-12 rounded-md border border-purple-500 text-purple-300' : 'flex items-center justify-center w-12 h-12 rounded-md border border-purple-500 text-purple-600')

	const completeFilled = 'px-4 py-1 rounded-md bg-orange-600 text-white text-sm shadow'
	const completeOutline = computed(() => isDark.value ? 'px-4 py-1 rounded-md border-2 border-purple-600 text-purple-300 text-sm' : 'px-4 py-1 rounded-md border-2 border-purple-600 text-purple-600 text-sm')

	const cardClass = computed(() => isDark.value ? 'bg-neutral-800 rounded-lg p-6 border border-neutral-700' : 'bg-white rounded-lg p-6 border border-gray-200 shadow-sm')
	const inputClass = computed(() => isDark.value ? 'mt-1 w-full rounded-md px-3 py-2 bg-gray-800 border border-neutral-700 text-gray-100' : 'mt-1 w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900')
	const textareaClass = computed(() => isDark.value ? 'mt-1 w-full rounded-md px-3 py-2 bg-gray-800 border border-neutral-700 text-gray-100' : 'mt-1 w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900')
	const subStepActiveClass = computed(() => 'px-3 py-1 rounded-full inline-block ' + (isDark.value ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'))
	const subStepInactiveClass = computed(() => 'px-3 py-1 rounded-full inline-block ' + (isDark.value ? 'bg-neutral-800 text-gray-300' : 'bg-gray-200 text-gray-700'))

	function openModal(idx) {
		modalActive.value = idx
		modalOpen.value = true
		subStepIndex.value = 0
	}

	function closeModal() {
		modalOpen.value = false
		modalActive.value = -1
		subStepIndex.value = 0
	}

	const modalStepTitle = computed(() => (modalActive.value >= 0 ? steps[modalActive.value].title : ''))
	const modalStepSubtitle = computed(() => (modalActive.value >= 0 ? steps[modalActive.value].subtitle : ''))

	const modalSubSteps = computed(() => {
		if (modalActive.value === 0) return ['Main data', 'Engine & environment', 'Condition & Inspection']
		if (modalActive.value === 1) return ['Colour & Interior', 'Safety', 'Comfort', 'Infotainment', 'Extras']
		if (modalActive.value === 2) return ['Title & description', 'Price', 'Pictures & video']
		if (modalActive.value === 3) return ['Name', 'Address', 'Phone number']
		return []
	})

	function prevSub() {
		if (subStepIndex.value > 0) subStepIndex.value--
	}

	function handleBack() {
		// If we're inside a sub-step, go to previous sub-step; otherwise close the modal (go back to page)
		if (subStepIndex.value > 0) {
			prevSub()
		} else {
			closeModal()
		}
	}

	function nextSub() {
				// validate required fields for the current sub-step before moving on
				if (!validateSub()) {
					// show errors then scroll to top so the user sees them
					nextTick(() => setTimeout(scrollToTop, 50))
					return
				}
				if (subStepIndex.value < modalSubSteps.value.length - 1) subStepIndex.value++
				// ensure DOM updated then scroll
				nextTick(() => setTimeout(scrollToTop, 50))
	}

	// Validate only the fields relevant to the current sub-step (per-step granularity)
	function validateSub() {
		const i = modalActive.value
		const s = subStepIndex.value
		// keep existing errors object but reset keys for this step
		errors[i] = {}
		let ok = true

		// Vehicle (modal 0) validations scoped per sub-step
		if (i === 0) {
			if (s === 0) {
				if (!vehicle.make) { errors[i].make = 'Make is required'; ok = false }
				if (!vehicle.model) { errors[i].model = 'Model is required'; ok = false }
				if (!vehicle.regYear) { errors[i].year = 'Registration year is required'; ok = false }
			}
			if (s === 1) {
				if (!vehicle.fuel) { errors[i].fuel = 'Fuel is required'; ok = false }
			}
			if (s === 2) {
				if (!vehicle.mileage && vehicle.mileage !== 0) { errors[i].mileage = 'Mileage is required'; ok = false }
				if (!vehicle.damaged) { errors[i].damaged = 'Select whether vehicle is damaged'; ok = false }
			}
		}

		// Equipment (modal 1) per-sub-step requirements
		// if (i === 1) {
			// if (s === 0) {
			// 	if (!(equipment.colors.length || equipment.materials.length || equipment.interiorColor || equipment.metallic)) {
			// 		errors[i].colour = 'Select at least one exterior colour or material'
			// 		ok = false
			// 	}
			// }
			// if (s === 1) {
			// 	if (!(equipment.safetyFeatures.length || equipment.cruise || equipment.isofix || equipment.passengerIsofix || equipment.alarmSystem || equipment.engineImmobilizer || equipment.speedLimitControl || equipment.distanceWarning || equipment.headlightWasher || equipment.glareFreeHighBeam || equipment.highBeamAssist)) {
			// 		errors[i].safety = 'Select at least one safety feature'
			// 		ok = false
			// 	}
			// }
			// if (s === 2) {
			// 	if (!(
			// 		(equipment.climatization && equipment.climatization !== 'Please select') ||
			// 		equipment.auxiliaryHeating || equipment.heatedWindshield || equipment.heatedSteeringWheel ||
			// 		(equipment.heatedSeats && equipment.heatedSeats.length) || (equipment.electricSeats && equipment.electricSeats.length) || (equipment.seatFeatures && equipment.seatFeatures.length) || (equipment.otherComfort && equipment.otherComfort.length)
			// 	)) {
			// 		errors[i].comfort = 'Complete at least one comfort option'
			// 		ok = false
			// 	}
			// }
			// if (s === 3) {
			// 	if (!(equipment.infotainmentFeatures && equipment.infotainmentFeatures.length)) {
			// 		errors[i].infotainment = 'Select at least one infotainment feature'
			// 		ok = false
			// 	}
			// }
			// if (s === 4) {
			// 	if (!(
			// 		equipment.tires && equipment.tires.length ||
			// 		(equipment.breakdownService && equipment.breakdownService !== 'Please select') ||
			// 		equipment.tirePressureMonitoring ||
			// 		(equipment.extrasFeatures && equipment.extrasFeatures.length) ||
			// 		(equipment.trailerCoupling && equipment.trailerCoupling !== 'Please select')
			// 	)) {
			// 		errors[i].extras = 'Complete at least one extras option'
			// 		ok = false
			// 	}
			// }
		// }

		// Details
		if (i === 2) {
			if (s === 0) {
				if (!details.title) { errors[i].title = 'Highlight is required'; ok = false }
				if (details.title && details.title.length > 27) { errors[i].title = 'Highlight must be at most 27 characters'; ok = false }
			}
			if (s === 1) {
				if (!details.price && details.price !== 0) { errors[i].price = 'Price is required'; ok = false }
			}
			if (s === 2) {
				if (!details.images || details.images.length === 0) { errors[i].images = 'Please upload at least one image'; ok = false }
			}
		}

		// Contact
		if (i === 3) {
			if (s === 0) {
				if (!contact.firstName) { errors[i].firstName = 'First name is required'; ok = false }
				if (!contact.lastName) { errors[i].lastName = 'Last name is required'; ok = false }
				if (!contact.displayName) { errors[i].displayName = 'Please choose whether your name should be displayed'; ok = false }
			}
			if (s === 1) {
				if (!contact.street) { errors[i].street = 'Street is required'; ok = false }
				if (!contact.number) { errors[i].number = 'No. is required'; ok = false }
				if (!contact.zip) { errors[i].zip = 'Zip is required'; ok = false }
				if (!contact.city) { errors[i].city = 'City is required'; ok = false }
			}
			if (s === 2) {
				if (!contact.phone) { errors[i].phone = 'Phone is required'; ok = false }
			}
		}

		return ok
	}

	function validateStep(i) {
		errors[i] = {}
		let ok = true
		if (i === 0) {
			if (!vehicle.make) { errors[i].make = 'Make is required'; ok = false }
			if (!vehicle.model) { errors[i].model = 'Model is required'; ok = false }
			if (!vehicle.regYear) { errors[i].year = 'Registration year is required'; ok = false }
		}
		// Equipment (i === 1) has no mandatory fields — allow saving even if empty
		if (i === 2) {
			if (!details.title) { errors[i].title = 'Highlight is required'; ok = false }
			if (details.title && details.title.length > 27) { errors[i].title = 'Highlight must be at most 27 characters'; ok = false }
			if (!details.price && details.price !== 0) { errors[i].price = 'Price is required'; ok = false }
			if (!details.images || details.images.length === 0) { errors[i].images = 'Please upload at least one image'; ok = false }
		}
		if (i === 3) {
			if (!contact.firstName) { errors[i].firstName = 'First name is required'; ok = false }
			if (!contact.lastName) { errors[i].lastName = 'Last name is required'; ok = false }
			if (!contact.displayName) { errors[i].displayName = 'Please choose whether your name should be displayed'; ok = false }
			if (!contact.phone) { errors[i].phone = 'Phone is required'; ok = false }
			if (!contact.street) { errors[i].street = 'Street is required'; ok = false }
			if (!contact.number) { errors[i].number = 'No. is required'; ok = false }
			if (!contact.zip) { errors[i].zip = 'Zip is required'; ok = false }
			if (!contact.city) { errors[i].city = 'City is required'; ok = false }
		}
		return ok
	}

	function saveStepFromModal() {
		const i = modalActive.value
		if (validateStep(i)) {
			completed.value[i] = true
			closeModal()
			// wait for modal to close and DOM to update then scroll main/window
			nextTick(() => setTimeout(scrollToTop, 50))
		} else {
			// remain open so user can see errors; scroll up to reveal them
			nextTick(() => setTimeout(scrollToTop, 50))
		}
	}

	function scrollToTop() {
		nextTick(() => {
			// Try multiple scroll targets and repeat briefly to handle timing/layout cases
			let tries = 0
			const maxTries = 8
			const doScroll = () => {
				try {
					const main = document.querySelector('main')
					if (main) {
						if (typeof main.scrollTo === 'function') main.scrollTo({ top: 0, behavior: 'smooth' })
						else main.scrollTop = 0
					}

					const el = document.scrollingElement || document.documentElement || document.body
					if (el) {
						if (typeof el.scrollTo === 'function') el.scrollTo({ top: 0, behavior: 'smooth' })
						else el.scrollTop = 0
					}

					if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' })
				} catch (e) {
					// ignore
				}
				tries++
				if (tries >= maxTries) clearInterval(timer)
			}
			doScroll()
			const timer = setInterval(doScroll, 80)
		})
	}

	const fileInput = ref(null)
	const dragIndex = ref(null)
	const areaDrag = ref(false)

	function openFilePicker() {
		if (fileInput.value) fileInput.value.click()
	}

	function handleAreaDrop(e) {
		areaDrag.value = false
		onDropFiles(e)
	}

	function onImagesSelected(e) {
		const files = Array.from(e.target.files || [])
		addFiles(files)
		// reset input so same file can be re-selected if needed
		if (e.target) e.target.value = null
	}

	function onDropFiles(e) {
		const files = Array.from(e.dataTransfer.files || [])
		addFiles(files)
	}

	function addFiles(files) {
		if (!Array.isArray(files) || files.length === 0) return
		const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
		let oversize = []
		const remaining = Math.max(0, 9 - details.images.length)
		const toAdd = []
		for (const f of files) {
			if (!f || !f.type || !f.type.startsWith('image/')) continue
			if (f.size > MAX_SIZE) {
				oversize.push(f.name || f.type)
				continue
			}
			if (toAdd.length < remaining) toAdd.push(f)
		}
		if (oversize.length) {
			errors[2].images = 'These files exceed 10 MB and were not added: ' + oversize.join(', ')
		} else {
			errors[2].images = undefined
		}
		const newItems = toAdd.map(f => ({ file: f, url: URL.createObjectURL(f) }))
		details.images = details.images.concat(newItems)
	}

	function handleDragStart(e, idx) {
		dragIndex.value = idx
		try { e.dataTransfer.setData('text/plain', String(idx)) } catch (err) {}
		e.dataTransfer.effectAllowed = 'move'
	}

	function handleDragOver(e, idx) {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	function handleDrop(e, idx) {
		e.preventDefault()
		let from = dragIndex.value
		if (from === null || from === undefined) {
			try { from = Number(e.dataTransfer.getData('text/plain')) } catch (err) { from = null }
		}
		if (from === null || isNaN(from)) return
		moveImage(from, idx)
		dragIndex.value = null
	}

	function moveImage(from, to) {
		if (from === to) return
		const arr = details.images.slice()
		if (from < 0 || from >= arr.length) return
		const [item] = arr.splice(from, 1)
		arr.splice(to, 0, item)
		details.images = arr
	}

	function removeImage(idx) {
		const item = details.images[idx]
		if (!item) return
		try { URL.revokeObjectURL(item.url) } catch (err) {}
		details.images.splice(idx, 1)
	}

	// --- UI helpers / wrappers for the design template ---
	const form = computed(() => ({ images: details.images.map(i => i.url) }))

	// const mainLabel = computed(() => details.images.length ? 'Add more photos' : 'Drop images here or click to upload')
	const uploaderBgClass = computed(() => isDark.value ? 'bg-gray-800 border border-neutral-700' : 'bg-white border border-gray-300')
	const removeBtnColorClass = computed(() => isDark.value ? 'bg-neutral-800 text-white' : 'bg-white text-gray-900')
	const placeholderBorderClass = computed(() => (uploaderBgClass.value))
	const dragOverIndex = computed(() => dragIndex.value)

	const selectBtnClass = computed(() => isDark.value ? 'text-white' : 'text-black')

	function triggerFileInput() { openFilePicker() }
	function onFilesSelected(e) { onImagesSelected(e) }
	function onDragStart(idx, e) { handleDragStart(e, idx) }
	function onDragEnd() { dragIndex.value = null }
	function onDragOver(idx, e) { handleDragOver(e, idx) }
	function onDrop(idx, e) { handleDrop(e, idx) }

	const allComplete = computed(() => completed.value.every(Boolean))

	function saveAd() {
		if (!allComplete.value) return
		const payload = { vehicle: { ...vehicle }, equipment: { ...equipment }, details: { ...details }, contact: { ...contact } }
		console.log('Ad saved (payload):', payload)
		alert('Ad saved (check console).')
	}
</script>