class ParseRowException(Exception):
    def __init__(self, blocks):
        self.blocks = blocks

