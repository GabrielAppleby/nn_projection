class Digit:

    def __init__(self,
                 uid: int,
                 label: str,
                 features: any) -> None:
        self.uid = uid
        self.label = label
        self.features = features
        super().__init__()
