from . import example_bp

@example_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}
