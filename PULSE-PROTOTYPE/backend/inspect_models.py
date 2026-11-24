
from ultralytics import YOLO

models = {
    "Brain": "brain_model.pt",
    "Fracture": "fracture_model.pt",
    "Kidney": "kidney_model.pt",
}

for name, path in models.items():
    print("\n" + "=" * 60)
    print("MODEL:", name)

    model = YOLO(path)

    print("Architecture:", model.model.__class__.__name__)
    print("Classes:", model.names)
    print("Number of classes:", len(model.names))
    print("Stride:", model.model.stride.tolist())

    checkpoint = model.ckpt

    if checkpoint:
        print("Training arguments:")
        print(checkpoint.get("train_args", {}))

        print("Stored metrics:")
        print(checkpoint.get("best_fitness"))

        print("Training epoch:")
        print(checkpoint.get("epoch"))

        print("Best model:", checkpoint.get("best_model"))
