// 中国985高校地图 - 主要JavaScript文件
class UniversityMap {
    constructor() {
        this.map = null;
        this.universities = [];
        this.markers = [];
        this.currentTheme = 'light';
        this.filteredUniversities = [];
        this.provinceLayer = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadUniversityData();
            this.initializeMap();
            this.setupEventListeners();
            this.createParticles();
            this.initializeAnimations();
            this.hideLoading();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('地图初始化失败，请刷新页面重试。');
        }
    }
    
    async loadUniversityData() {
        try {
            const response = await fetch('./resources/university-data.json');
            if (!response.ok) {
                throw new Error('无法加载高校数据');
            }
            const data = await response.json();
            this.universities = data.universities;
            this.regions = data.regions;
            this.filteredUniversities = [...this.universities];
        } catch (error) {
            console.error('加载数据失败:', error);
            // 使用备用数据
            this.universities = this.getBackupData();
            this.filteredUniversities = [...this.universities];
        }
    }
    
    getBackupData() {
        // 简化的备用数据
        return [
            {
                id: 1,
                name: "北京大学",
                city: "北京",
                province: "北京市",
                coordinates: [39.9911, 116.3059],
                website: "http://www.pku.edu.cn",
                type: "综合类",
                specialties: ["经济学类", "法学", "生物科学"],
                description: "中国顶尖综合性大学",
                region: "华北"
            },
            {
                id: 2,
                name: "清华大学",
                city: "北京",
                province: "北京市",
                coordinates: [40.0020, 116.3266],
                website: "http://www.tsinghua.edu.cn",
                type: "工科类",
                specialties: ["经济与金融", "土木工程", "建筑学"],
                description: "中国顶尖工科大学",
                region: "华北"
            }
            // 可以添加更多备用数据...
        ];
    }
    
    initializeMap() {
        // 初始化Leaflet地图
        this.map = L.map('map', {
            center: [35.0, 105.0], // 中国中心点
            zoom: 5,
            minZoom: 4,
            maxZoom: 12,
            zoomControl: false,
            attributionControl: true
        });
        
        // 设置地图背景色
        const mapContainer = document.getElementById('map');
        mapContainer.style.background = this.currentTheme === 'dark' ? '#2D3748' : '#F7FAFC';
        
        // 添加自定义地图图层
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | 985高校地图数据',
            maxZoom: 18
        });
        
        this.map.addLayer(tileLayer);
        
        // 加载省级行政区划
        await this.loadProvinces();
        
        // 添加缩放控件
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
        
        // 添加比例尺
        L.control.scale({
            position: 'bottomleft',
            imperial: false
        }).addTo(this.map);
        
        // 添加高校标记
        this.addUniversityMarkers();
        
        // 设置地图样式
        this.updateMapStyle();
    }
    
    addUniversityMarkers() {
        this.markers = [];
        
        this.universities.forEach(university => {
            // 创建自定义标记
            const marker = L.circleMarker(university.coordinates, {
                radius: 8,
                fillColor: '#f97316',
                color: '#fb923c',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.8,
                className: 'university-marker'
            });
            
            // 添加悬停效果
            marker.on('mouseover', (e) => {
                this.onMarkerHover(e, university);
            });
            
            marker.on('mouseout', (e) => {
                this.onMarkerLeave(e);
            });
            
            // 添加点击事件
            marker.on('click', (e) => {
                this.onMarkerClick(university);
            });
            
            // 添加提示信息
            const popupContent = this.createPopupContent(university);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            marker.universityData = university;
            this.markers.push(marker);
            marker.addTo(this.map);
        });
    }
    
    createPopupContent(university) {
        return `
            <div class="p-3 min-w-64">
                <h3 class="font-bold text-lg text-primary-blue mb-2">${university.name}</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>${university.city}, ${university.province}</span>
                    </div>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>${university.type}</span>
                    </div>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                        <a href="${university.website}" target="_blank" class="text-accent-orange hover:underline">访问官网</a>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-xs text-gray-600">特色学科: ${university.specialties ? university.specialties.slice(0, 3).join(', ') : '暂无'}</p>
                </div>
                <button onclick="universityMap.showUniversityDetail(${university.id})" 
                        class="mt-3 w-full bg-primary-blue text-white py-2 px-4 rounded-lg hover:bg-secondary-blue transition-colors text-sm">
                    查看详情
                </button>
            </div>
        `;
    }
    
    onMarkerHover(e, university) {
        const marker = e.target;
        marker.setStyle({
            radius: 12,
            fillOpacity: 1
        });
        
        // 显示高校名称
        this.showTooltip(university.name, e.containerPoint);
    }
    
    onMarkerLeave(e) {
        const marker = e.target;
        marker.setStyle({
            radius: 8,
            fillOpacity: 0.8
        });
        
        this.hideTooltip();
    }
    
    onMarkerClick(university) {
        this.showUniversityDetail(university);
    }
    
    showTooltip(text, point) {
        // 实现悬停提示
        let tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'map-tooltip';
            tooltip.className = 'absolute bg-black text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.left = point.x + 10 + 'px';
        tooltip.style.top = point.y - 30 + 'px';
        tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        // 主题切换
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchUniversities(e.target.value);
        });
        
        // 筛选功能
        const regionFilter = document.getElementById('regionFilter');
        const typeFilter = document.getElementById('typeFilter');
        
        regionFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        typeFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        // 地图控制
        const resetView = document.getElementById('resetView');
        resetView.addEventListener('click', () => {
            this.resetMapView();
        });
        
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // 模态框控制
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('universityModal');
        
        closeModal.addEventListener('click', () => {
            this.hideUniversityDetail();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideUniversityDetail();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideUniversityDetail();
            }
            if (e.key === 'f' && e.ctrlKey) {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }
    
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        this.currentTheme = newTheme;
        
        // 更新地图样式
        this.updateMapStyle();
        
        // 保存主题偏好
        localStorage.setItem('theme', newTheme);
        
        // 添加切换动画
        anime({
            targets: 'body',
            duration: 300,
            easing: 'easeInOutQuad'
        });
    }
    
    async loadProvinces() {
        try {
            // 加载省级行政区划GeoJSON数据
            const response = await fetch('./resources/china-provinces.geojson');
            if (!response.ok) {
                throw new Error('无法加载省级地图数据');
            }
            
            const provincesData = await response.json();
            
            // 添加省级行政区划图层
            this.provinceLayer = L.geoJSON(provincesData, {
                style: (feature) => {
                    const isDark = this.currentTheme === 'dark';
                    return {
                        fillColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                        color: isDark ? '#3b82f6' : '#1e3a8a',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: isDark ? 0.3 : 0.1
                    };
                },
                onEachFeature: (feature, layer) => {
                    // 添加省份名称标签
                    const center = layer.getBounds().getCenter();
                    const provinceName = feature.properties.name;
                    
                    // 创建省份标签
                    const label = L.divIcon({
                        className: 'province-label',
                        html: `<div style="background: ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'}; 
                                     color: ${this.currentTheme === 'dark' ? 'white' : 'black'}; 
                                     padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;
                                     box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                 ${provinceName}
                               </div>`,
                        iconSize: [100, 20],
                        iconAnchor: [50, 10]
                    });
                    
                    L.marker(center, { icon: label }).addTo(this.map);
                    
                    // 添加省份交互
                    layer.on({
                        mouseover: (e) => {
                            this.highlightProvince(e.target);
                        },
                        mouseout: (e) => {
                            this.resetProvinceHighlight(e.target);
                        },
                        click: (e) => {
                            this.onProvinceClick(feature, e.target);
                        }
                    });
                }
            }).addTo(this.map);
            
        } catch (error) {
            console.error('加载省级地图失败:', error);
            // 如果加载失败，继续使用基础地图
        }
    }
    
    highlightProvince(layer) {
        const isDark = this.currentTheme === 'dark';
        layer.setStyle({
            fillColor: isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)',
            color: '#f97316',
            weight: 3,
            fillOpacity: isDark ? 0.4 : 0.3
        });
    }
    
    resetProvinceHighlight(layer) {
        const isDark = this.currentTheme === 'dark';
        layer.setStyle({
            fillColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            color: isDark ? '#3b82f6' : '#1e3a8a',
            weight: 2,
            fillOpacity: isDark ? 0.3 : 0.1
        });
    }
    
    onProvinceClick(provinceFeature, layer) {
        // 缩放到省份
        const bounds = layer.getBounds();
        this.map.fitBounds(bounds, { padding: [20, 20] });
        
        // 显示省份信息
        this.showProvinceInfo(provinceFeature);
        
        // 筛选该省份的高校
        const provinceName = provinceFeature.properties.name;
        const provinceUniversities = this.universities.filter(uni => 
            uni.province === provinceName
        );
        
        if (provinceUniversities.length > 0) {
            this.showProvinceUniversities(provinceUniversities, provinceName);
        } else {
            this.showNoUniversitiesInProvince(provinceName);
        }
    }
    
    showProvinceInfo(provinceFeature) {
        const provinceInfo = document.getElementById('provinceInfo');
        const provinceDetails = document.getElementById('provinceDetails');
        
        const provinceName = provinceFeature.properties.name;
        const provinceUniversities = this.universities.filter(uni => 
            uni.province === provinceName
        );
        
        provinceDetails.innerHTML = `
            <div class="space-y-3">
                <h5 class="font-semibold text-lg text-primary-blue">${provinceName}</h5>
                <div class="flex justify-between">
                    <span class="text-gray-600">985高校数量:</span>
                    <span class="font-semibold text-accent-orange">${provinceUniversities.length}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">行政区划代码:</span>
                    <span class="font-mono text-sm">${provinceFeature.properties.adcode}</span>
                </div>
                ${provinceUniversities.length > 0 ? `
                <div class="mt-4">
                    <h6 class="font-semibold mb-2">省内高校:</h6>
                    <div class="space-y-1">
                        ${provinceUniversities.slice(0, 5).map(uni => `
                            <div class="text-sm text-gray-600">• ${uni.name}</div>
                        `).join('')}
                        ${provinceUniversities.length > 5 ? `
                        <div class="text-sm text-gray-500">...等${provinceUniversities.length - 5}所</div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        provinceInfo.style.display = 'block';
    }
    
    showProvinceUniversities(universities, provinceName) {
        const listContainer = document.getElementById('universityList');
        
        listContainer.innerHTML = `
            <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h5 class="font-semibold text-primary-blue">${provinceName} 985高校 (${universities.length}所)</h5>
            </div>
            ${universities.map(uni => `
                <div class="university-item" onclick="universityMap.focusOnUniversity(${uni.id})">
                    <div class="flex items-center justify-between">
                        <div>
                            <h5 class="font-semibold text-primary">${uni.name}</h5>
                            <p class="text-sm text-gray-600">${uni.city} · ${uni.type}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-xs bg-accent-orange text-white px-2 py-1 rounded">${uni.region}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    showNoUniversitiesInProvince(provinceName) {
        const listContainer = document.getElementById('universityList');
        
        listContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m0 0L3.34 9.092M6.646 4.646L12 10l5.354-5.354M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>${provinceName}暂无985高校</p>
                <p class="text-sm mt-2">该省份没有985工程大学</p>
            </div>
        `;
    }
    
    updateMapStyle() {
        if (!this.map) return;
        
        const isDark = this.currentTheme === 'dark';
        
        // 更新标记样式
        this.markers.forEach(marker => {
            marker.setStyle({
                fillColor: isDark ? '#fb923c' : '#f97316',
                color: isDark ? '#f97316' : '#fb923c'
            });
        });
        
        // 更新地图容器样式
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.background = isDark ? '#374151' : '#f1f5f9';
        }
        
        // 更新省份图层样式
        if (this.provinceLayer) {
            this.provinceLayer.setStyle((feature) => {
                return {
                    fillColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: isDark ? '#3b82f6' : '#1e3a8a',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: isDark ? 0.3 : 0.1
                };
            });
        }
    }
    
    searchUniversities(query) {
        if (!query.trim()) {
            this.filteredUniversities = [...this.universities];
        } else {
            this.filteredUniversities = this.universities.filter(uni => 
                uni.name.toLowerCase().includes(query.toLowerCase()) ||
                uni.city.toLowerCase().includes(query.toLowerCase()) ||
                uni.province.toLowerCase().includes(query.toLowerCase()) ||
                (uni.specialties && uni.specialties.some(spec => 
                    spec.toLowerCase().includes(query.toLowerCase())
                ))
            );
        }
        
        this.updateMarkers();
        this.updateUniversityList();
        this.updateStatistics();
    }
    
    applyFilters() {
        const regionFilter = document.getElementById('regionFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchQuery = document.getElementById('searchInput').value;
        
        this.filteredUniversities = this.universities.filter(uni => {
            const matchesSearch = !searchQuery.trim() || 
                uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                uni.city.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesRegion = !regionFilter || uni.region === regionFilter;
            const matchesType = !typeFilter || uni.type === typeFilter;
            
            return matchesSearch && matchesRegion && matchesType;
        });
        
        this.updateMarkers();
        this.updateUniversityList();
        this.updateStatistics();
    }
    
    updateMarkers() {
        // 清除现有标记
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        
        // 重新添加筛选后的标记
        this.markers = [];
        
        this.filteredUniversities.forEach(university => {
            const marker = L.circleMarker(university.coordinates, {
                radius: 8,
                fillColor: '#f97316',
                color: '#fb923c',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            const popupContent = this.createPopupContent(university);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            marker.on('mouseover', (e) => {
                this.onMarkerHover(e, university);
            });
            
            marker.on('mouseout', (e) => {
                this.onMarkerLeave(e);
            });
            
            marker.on('click', (e) => {
                this.onMarkerClick(university);
            });
            
            marker.universityData = university;
            this.markers.push(marker);
            marker.addTo(this.map);
        });
    }
    
    updateUniversityList() {
        const listContainer = document.getElementById('universityList');
        
        if (this.filteredUniversities.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m0 0L3.34 9.092M6.646 4.646L12 10l5.354-5.354M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>未找到匹配的高校</p>
                </div>
            `;
            return;
        }
        
        listContainer.innerHTML = this.filteredUniversities.map(uni => `
            <div class="university-item" onclick="universityMap.focusOnUniversity(${uni.id})">
                <div class="flex items-center justify-between">
                    <div>
                        <h5 class="font-semibold text-primary">${uni.name}</h5>
                        <p class="text-sm text-gray-600">${uni.city} · ${uni.type}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs bg-accent-gold text-white px-2 py-1 rounded">${uni.region}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateStatistics() {
        const displayCount = document.getElementById('displayCount');
        displayCount.textContent = this.filteredUniversities.length;
        
        // 计算覆盖的省份数
        const provinces = new Set(this.filteredUniversities.map(uni => uni.province));
        const provinceCount = document.getElementById('provinceCount');
        provinceCount.textContent = provinces.size;
    }
    
    focusOnUniversity(universityId) {
        const university = this.universities.find(uni => uni.id === universityId);
        if (university) {
            this.map.setView(university.coordinates, 12);
            
            // 找到对应的标记并打开弹窗
            const marker = this.markers.find(m => 
                m.universityData && m.universityData.id === universityId
            );
            if (marker) {
                marker.openPopup();
            }
        }
    }
    
    showUniversityDetail(university) {
        const modal = document.getElementById('universityModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = university.name;
        
        content.innerHTML = `
            <div class="space-y-6">
                <!-- 基本信息 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold text-lg mb-3 text-primary-green">基本信息</h4>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>${university.city}, ${university.province}</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>${university.type}</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>建校时间: ${university.established || '未知'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-lg mb-3 text-primary-green">联系方式</h4>
                        <div class="space-y-3">
                            <a href="${university.website}" target="_blank" 
                               class="flex items-center text-accent-orange hover:underline">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                                访问官网
                            </a>
                            <button onclick="universityMap.focusOnUniversity(${university.id})" 
                                    class="flex items-center text-accent-gold hover:underline">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                地图定位
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 特色学科 -->
                ${university.specialties && university.specialties.length > 0 ? `
                <div>
                    <h4 class="font-semibold text-lg mb-3 text-primary-green">特色学科</h4>
                    <div class="flex flex-wrap gap-2">
                        ${university.specialties.map(spec => `
                            <span class="bg-accent-gold text-white px-3 py-1 rounded-full text-sm">${spec}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- 学校简介 -->
                ${university.description ? `
                <div>
                    <h4 class="font-semibold text-lg mb-3 text-primary-green">学校简介</h4>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${university.description}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // 添加显示动画
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutBack'
        });
    }
    
    hideUniversityDetail() {
        const modal = document.getElementById('universityModal');
        modal.classList.add('hidden');
    }
    
    resetMapView() {
        this.map.setView([35.0, 105.0], 5);
    }
    
    toggleFullscreen() {
        const mapContainer = document.getElementById('map');
        
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().catch(err => {
                console.log('无法进入全屏模式:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机大小和位置
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    initializeAnimations() {
        // 初始化文字分割动画
        Splitting();
        
        // 页面加载动画
        anime.timeline({
            easing: 'easeOutExpo',
            duration: 800
        })
        .add({
            targets: '.fade-in',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(200)
        })
        .add({
            targets: '.slide-in-left',
            opacity: [0, 1],
            translateX: [-50, 0],
            delay: anime.stagger(100)
        }, '-=400')
        .add({
            targets: '.slide-in-right',
            opacity: [0, 1],
            translateX: [50, 0],
            delay: anime.stagger(100)
        }, '-=600');
    }
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        anime({
            targets: loadingOverlay,
            opacity: [1, 0],
            duration: 500,
            easing: 'easeOutQuad',
            complete: () => {
                loadingOverlay.style.display = 'none';
            }
        });
    }
    
    showError(message) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.innerHTML = `
            <div class="text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-600 text-lg font-semibold mb-2">加载失败</p>
                <p class="text-gray-600">${message}</p>
                <button onclick="location.reload()" class="mt-4 btn-primary">
                    重新加载
                </button>
            </div>
        `;
    }
}

// 全局函数
function showAllUniversities() {
    universityMap.resetMapView();
    universityMap.applyFilters();
}

function randomUniversity() {
    const randomIndex = Math.floor(Math.random() * universityMap.universities.length);
    const randomUni = universityMap.universities[randomIndex];
    universityMap.showUniversityDetail(randomUni);
}

function exportData() {
    const data = {
        universities: universityMap.filteredUniversities,
        exportTime: new Date().toISOString(),
        totalCount: universityMap.filteredUniversities.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '985-universities-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 初始化应用
let universityMap;

document.addEventListener('DOMContentLoaded', () => {
    universityMap = new UniversityMap();
    
    // 加载保存的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        universityMap.currentTheme = savedTheme;
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (universityMap && universityMap.map) {
        universityMap.map.remove();
    }
});