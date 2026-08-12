import logging

logger = logging.getLogger("email_service")


def send_order_confirmation_email(
    customer_email: str, order_number: str, total_amount: str, items_summary: str
) -> bool:
    """
    Simulates sending order confirmation email to the customer.
    """
    logger.info(
        f"[EMAIL] Order Confirmation sent to {customer_email} for Order #{order_number}. "
        f"Total: ${total_amount}. Items: {items_summary}"
    )
    return True


def send_shipping_dispatch_email(
    customer_email: str, order_number: str, tracking_number: str
) -> bool:
    """
    Simulates sending shipping tracking dispatch email to the customer.
    """
    logger.info(
        f"[EMAIL] Shipping Dispatch sent to {customer_email} for Order #{order_number}. "
        f"Tracking Number: {tracking_number}"
    )
    return True
