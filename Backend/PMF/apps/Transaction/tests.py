from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from decimal import Decimal

class TransactionFeeAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('transaction-fees')  # Use your actual URL name

    def test_calculate_fee_success(self):
        # Test with valid amount
        response = self.client.get(self.url, {'amount': '100.00'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'transaction_fee': '2.00'})  # 2% of 100

    def test_calculate_fee_zero_amount(self):
        # Test with zero amount
        response = self.client.get(self.url, {'amount': '0'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'transaction_fee': '0.00'})

    def test_calculate_fee_no_amount(self):
        # Test missing amount (defaults to 0)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'transaction_fee': '0.00'})

    def test_calculate_fee_invalid_amount(self):
        # Test non-numeric input
        response = self.client.get(self.url, {'amount': 'invalid'})
        self.assertEqual(response.status_code, 400)  # Bad request