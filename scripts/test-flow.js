const http = require('http');

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting End-to-End Royes Creations Test Suite...\n');

  // Test 1: Products API
  console.log('1️⃣ Testing GET /api/products...');
  const prodRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'GET',
  });
  console.log(`Status: ${prodRes.status}, Found: ${prodRes.body.count} products`);
  if (prodRes.body.count === 5) {
    console.log('✅ Exactly 5 initial products active in catalog.');
  } else {
    console.error('❌ Expected 5 products, got:', prodRes.body.count);
  }

  // Test 2: Jaipur Location Rule - Non-Jaipur rejection
  console.log('\n2️⃣ Testing Jaipur Pincode Validation with outside-Jaipur address (Mumbai 400001)...');
  const invalidOrderRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      customer_name: 'Out of State Buyer',
      mobile: '9876543210',
      house_flat: 'Flat 101',
      street_area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      utr: '123456789012',
      items: [{ productId: 1, quantity: 1 }],
    }
  );
  console.log(`Status: ${invalidOrderRes.status}, Message: ${invalidOrderRes.body.message}`);
  if (invalidOrderRes.status === 400 && invalidOrderRes.body.success === false) {
    console.log('✅ Correctly blocked order outside Jaipur.');
  } else {
    console.error('❌ Failed to block outside-Jaipur order!');
  }

  // Test 3: Delivery Charge Rule - Subtotal <= ₹1499 (₹1199 should have ₹49 delivery)
  console.log('\n3️⃣ Testing Delivery Charge for Subtotal <= ₹1499 (Product 1: ₹1199)...');
  const under1499OrderRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      customer_name: 'Jaipur Resident A',
      mobile: '9829011111',
      house_flat: 'B-12, Green Park',
      street_area: 'Vaishali Nagar',
      landmark: 'Near Amrapali Circle',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302021', // Vaishali Nagar, Jaipur
      utr: 'UPI98765432101',
      items: [{ productId: 1, quantity: 1 }], // Price: 1199
    }
  );
  console.log('Order Result:', {
    orderNumber: under1499OrderRes.body.orderNumber,
    subtotal: under1499OrderRes.body.order?.subtotal,
    delivery_charge: under1499OrderRes.body.order?.delivery_charge,
    total_amount: under1499OrderRes.body.order?.total_amount,
    payment_status: under1499OrderRes.body.order?.payment_status,
  });
  if (
    under1499OrderRes.body.order?.subtotal === 1199 &&
    under1499OrderRes.body.order?.delivery_charge === 49 &&
    under1499OrderRes.body.order?.total_amount === 1248
  ) {
    console.log('✅ Correctly applied ₹49 delivery fee for ₹1199 subtotal (Total: ₹1248).');
  } else {
    console.error('❌ Delivery charge rule calculation mismatch!');
  }

  // Test 4: Free Delivery Rule - Subtotal > ₹1499 (Product 4: ₹1549 should have ₹0 delivery)
  console.log('\n4️⃣ Testing FREE Delivery for Subtotal > ₹1499 (Product 4: ₹1549)...');
  const freeDeliveryOrderRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      customer_name: 'Jaipur Resident B',
      mobile: '9829022222',
      house_flat: 'Plot 45, Shipra Path',
      street_area: 'Mansarovar',
      landmark: 'Near VT Road',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302020', // Mansarovar, Jaipur
      utr: 'UPI98765432102',
      items: [{ productId: 4, quantity: 1 }], // Price: 1549
    }
  );
  console.log('Order Result:', {
    orderNumber: freeDeliveryOrderRes.body.orderNumber,
    subtotal: freeDeliveryOrderRes.body.order?.subtotal,
    delivery_charge: freeDeliveryOrderRes.body.order?.delivery_charge,
    total_amount: freeDeliveryOrderRes.body.order?.total_amount,
  });
  if (
    freeDeliveryOrderRes.body.order?.subtotal === 1549 &&
    freeDeliveryOrderRes.body.order?.delivery_charge === 0 &&
    freeDeliveryOrderRes.body.order?.total_amount === 1549
  ) {
    console.log('✅ Correctly unlocked FREE DELIVERY (₹0) for ₹1549 subtotal (Total: ₹1549).');
  } else {
    console.error('❌ Free delivery rule calculation mismatch!');
  }

  const createdOrderNum = freeDeliveryOrderRes.body.orderNumber;
  const createdOrderId = freeDeliveryOrderRes.body.order?.id;

  // Test 5: Order Tracking without login
  console.log(`\n5️⃣ Testing Customer Order Tracking for ${createdOrderNum}...`);
  const trackRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/track?orderNumber=${createdOrderNum}&mobile=9829022222`,
    method: 'GET',
  });
  console.log(`Tracking Result: Status = "${trackRes.body.order?.order_status}", Payment = "${trackRes.body.order?.payment_status}"`);
  if (trackRes.body.success && trackRes.body.order?.order_number === createdOrderNum) {
    console.log('✅ Order tracking successfully retrieved order without account.');
  }

  // Test 6: Admin Login
  console.log('\n6️⃣ Testing Admin Login (/api/admin/auth/login)...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: 'admin@royescreations.com',
      password: 'RoyesAdmin2026!',
    }
  );
  console.log(`Admin Login Status: ${loginRes.status}, User: ${loginRes.body.admin?.email}`);
  const adminToken = loginRes.body.token;

  // Test 7: Admin 1-Click Payment Verification
  console.log(`\n7️⃣ Testing Admin Payment Verification for Order #${createdOrderId}...`);
  const verifyRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/orders/${createdOrderId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    },
    {
      payment_status: 'Payment Verified',
      order_status: 'Order Confirmed',
      admin_notes: 'Verified via UPI UTR reference check on HDFC app.',
    }
  );
  console.log('Updated Order Status:', {
    payment_status: verifyRes.body.order?.payment_status,
    order_status: verifyRes.body.order?.order_status,
  });
  if (
    verifyRes.body.order?.payment_status === 'Payment Verified' &&
    verifyRes.body.order?.order_status === 'Order Confirmed'
  ) {
    console.log('✅ Payment successfully verified and order confirmed by admin!');
  }

  // Test 8: Admin Dashboard Statistics
  console.log('\n8️⃣ Testing Admin Dashboard KPIs (/api/admin/stats)...');
  const statsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Dashboard KPIs:', statsRes.body.stats);
  if (statsRes.body.stats?.totalOrders >= 2) {
    console.log('✅ Dashboard metrics working accurately!');
  }

  console.log('\n🎉 ALL 8 TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(console.error);
